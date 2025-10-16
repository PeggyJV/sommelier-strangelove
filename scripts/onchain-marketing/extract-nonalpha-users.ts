import fs from "fs";
import path from "path";
import os from "os";
import pLimit from "p-limit";
import { JsonRpcProvider, id, Contract } from "ethers";
import { VAULTS, RPC, Chain } from "./vaults";
import { detectChunk, ensureCacheDir, loadProgress, saveProgress, keyOf, resolveStartBlock, latestBlock } from "./utils";

const OUT_DIR = process.env.OUT_DIR || path.join(os.homedir(), "Desktop", "on-chain-marketing", "outputs");
const FAST = process.env.FAST === "1"; // if true, scan only Deposit to build user set fast

const erc20Abi = ["function balanceOf(address) view returns (uint256)"];
const DEPOSIT_TOPIC  = id("Deposit(address,address,uint256,uint256)");
const WITHDRAW_TOPIC = id("Withdraw(address,address,address,uint256,uint256)");

type UserAgg = {
  firstSeenBlock: number;
  lastSeenBlock: number;
  deposits: number;
  withdrawals: number;
  sumDeposited: bigint;
  sumWithdrawn: bigint;
  perVaultSeen: Record<string, { deposits: number; withdrawals: number }>;
  activeVaults: string[];
};

const providers: Partial<Record<Chain, JsonRpcProvider>> = {};
const chunks: Partial<Record<Chain, number>> = {};
for (const [chain, url] of Object.entries(RPC)) {
  if (url) {
    providers[chain as Chain] = new JsonRpcProvider(url);
    chunks[chain as Chain] = detectChunk(url);
  }
}

function topicToAddr(t: string) { return ("0x" + t.slice(26)).toLowerCase(); }

async function getLogsSafe(provider: JsonRpcProvider, filter: any) {
  for (let i = 0; i < 4; i++) {
    try { return await provider.getLogs(filter); }
    catch { await new Promise(r => setTimeout(r, 400 * (i + 1))); }
  }
  return [];
}

async function scanVaultUsers(chain: Chain, address: string, name: string, startBlock?: number) {
  const provider = providers[chain]!;
  const latest = await latestBlock(provider);
  const fromBlock = typeof startBlock === "number" ? startBlock : await resolveStartBlock(address, chain);
  const step = chunks[chain] || 12000;

  const users = new Map<string, UserAgg>();
  const progress = loadProgress();

  const scanTopic = async (topic: string) => {
    const pKey = keyOf(address, topic);
    let from = Math.max(fromBlock, Number(progress[pKey] || fromBlock));
    for (; from <= latest; from += step + 1) {
      const to = Math.min(from + step, latest);
      const filter = { address, fromBlock: from, toBlock: to, topics: [topic] };
      const logs = await getLogsSafe(provider, filter);
      for (const log of logs) {
        let ownerTopic: string | undefined;
        if (log.topics[0].toLowerCase() === DEPOSIT_TOPIC.toLowerCase()) ownerTopic = log.topics[2];
        else if (log.topics[0].toLowerCase() === WITHDRAW_TOPIC.toLowerCase()) ownerTopic = log.topics[3];
        if (!ownerTopic) continue;
        const wallet = topicToAddr(ownerTopic);

        const prev = users.get(wallet) ?? {
          firstSeenBlock: log.blockNumber, lastSeenBlock: log.blockNumber,
          deposits: 0, withdrawals: 0, sumDeposited: 0n, sumWithdrawn: 0n,
          perVaultSeen: {}, activeVaults: [],
        };
        prev.firstSeenBlock = Math.min(prev.firstSeenBlock, log.blockNumber);
        prev.lastSeenBlock  = Math.max(prev.lastSeenBlock, log.blockNumber);

        if (log.topics[0].toLowerCase() === DEPOSIT_TOPIC.toLowerCase()) {
          prev.deposits += 1;
          if (log.data && log.data.length >= 2 + 64) {
            const assetsHex = "0x" + log.data.slice(2, 2 + 64);
            prev.sumDeposited += BigInt(assetsHex);
          }
          prev.perVaultSeen[name] = { deposits: (prev.perVaultSeen[name]?.deposits ?? 0) + 1, withdrawals: prev.perVaultSeen[name]?.withdrawals ?? 0 };
        } else {
          prev.withdrawals += 1;
          if (log.data && log.data.length >= 2 + 64) {
            const assetsHex = "0x" + log.data.slice(2, 2 + 64);
            prev.sumWithdrawn += BigInt(assetsHex);
          }
          prev.perVaultSeen[name] = { deposits: prev.perVaultSeen[name]?.deposits ?? 0, withdrawals: (prev.perVaultSeen[name]?.withdrawals ?? 0) + 1 };
        }
        users.set(wallet, prev);
      }
      process.stdout.write(`\r[${chain}] ${name} ${from}-${to} logs: ${logs.length}   `);
      // save resume point
      progress[pKey] = to + 1;
      ensureCacheDir(); saveProgress(progress);
    }
    process.stdout.write("\n");
  };

  await scanTopic(DEPOSIT_TOPIC);
  if (!FAST) await scanTopic(WITHDRAW_TOPIC); // skip in FAST mode

  return users;
}

async function markActives(global: Map<string, UserAgg>) {
  for (const v of VAULTS) {
    const provider = providers[v.chain]!;
    const token = new Contract(v.address, erc20Abi, provider);
    let i = 0;
    for (const [wallet, agg] of global) {
      i++;
      try {
        const bal: bigint = await token.balanceOf(wallet);
        if (bal > 0n) {
          if (!agg.activeVaults.includes(v.name)) agg.activeVaults.push(v.name);
          global.set(wallet, agg);
        }
      } catch {}
      if (i % 300 === 0) await new Promise(r => setTimeout(r, 30));
    }
  }
}

(async () => {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  const global = new Map<string, UserAgg>();

  // Parallelize vault scans (limit 5)
  const limit = pLimit(5);
  const tasks = VAULTS.map(v => limit(async () => {
    console.log(`Scanning events for ${v.name} (${v.chain})...`);
    const users = await scanVaultUsers(v.chain, v.address, v.name, v.startBlock);
    return { v, users };
  }));
  const results = await Promise.all(tasks);

  // Merge
  for (const { users } of results) {
    for (const [wallet, agg] of users) {
      const prev = global.get(wallet);
      if (!prev) global.set(wallet, agg);
      else {
        prev.firstSeenBlock = Math.min(prev.firstSeenBlock, agg.firstSeenBlock);
        prev.lastSeenBlock  = Math.max(prev.lastSeenBlock, agg.lastSeenBlock);
        prev.deposits      += agg.deposits;
        prev.withdrawals   += agg.withdrawals;
        prev.sumDeposited  += agg.sumDeposited;
        prev.sumWithdrawn  += agg.sumWithdrawn;
        prev.perVaultSeen   = { ...prev.perVaultSeen, ...agg.perVaultSeen };
        global.set(wallet, prev);
      }
    }
  }

  await markActives(global);

  const allRows = ["wallet,firstSeenBlock,lastSeenBlock,deposits,withdrawals,sumDepositedWei,sumWithdrawnWei,vaults_history"];
  const activeRows = ["wallet,vaults_active,firstSeenBlock,lastSeenBlock,deposits,withdrawals,sumDepositedWei,sumWithdrawnWei"];
  const debankRows = ["wallet"];
  const prevRows = ["wallet,firstSeenBlock,lastSeenBlock,deposits,withdrawals,sumDepositedWei,sumWithdrawnWei,vaults_history"];

  let activeCount = 0, prevCount = 0;

  for (const [wallet, agg] of global) {
    const history = Object.keys(agg.perVaultSeen).join("|");
    const common = [
      wallet, String(agg.firstSeenBlock), String(agg.lastSeenBlock),
      String(agg.deposits), String(agg.withdrawals),
      agg.sumDeposited.toString(), agg.sumWithdrawn.toString()
    ];
    allRows.push([...common, history].join(","));
    debankRows.push(wallet);

    if (agg.activeVaults.length > 0) {
      activeRows.push([wallet, agg.activeVaults.join("|"), ...common.slice(1)].join(","));
      activeCount++;
    } else {
      prevRows.push([...common, history].join(","));
      prevCount++;
    }
  }

  fs.writeFileSync(path.join(OUT_DIR, "nonalpha_all.csv"), allRows.join("\n"));
  fs.writeFileSync(path.join(OUT_DIR, "nonalpha_active.csv"), activeRows.join("\n"));
  fs.writeFileSync(path.join(OUT_DIR, "nonalpha_debank_list.csv"), debankRows.join("\n"));
  fs.writeFileSync(path.join(OUT_DIR, "nonalpha_previous.csv"), prevRows.join("\n"));

  console.log(`\nOutput dir: ${OUT_DIR}`);
  console.log(`Totals: all=${global.size}, active=${activeCount}, previous=${prevCount}`);
  console.log(`FAST mode: ${FAST ? "ON (Deposit only)" : "OFF (Deposit+Withdraw)"}`);
})();
