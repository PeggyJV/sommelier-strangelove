import { getAcceptedDepositAssetsByChain } from "data/tokenConfig"
import { ResolvedRegister } from "abitype"
import { readContracts } from "@wagmi/core"
import { erc20Abi, formatUnits, getAddress } from "viem"
import { useAccount } from "wagmi"
import { chainConfig } from "data/chainConfig"
import { fetchCoingeckoPrice } from "queries/get-coingecko-price"
import { useQuery } from "@tanstack/react-query"
import { wagmiConfig } from "context/wagmiContext"

type Balance = {
  decimals: ResolvedRegister['IntType'];
  formatted: string;
  symbol: string;
  value: ResolvedRegister['BigIntType'];
  valueInUSD: number;
}

export const useUserBalances = () => {

  const { address, chain } = useAccount();

  const fetchBalances = async () => {
    const depositAssetBalances : Balance[] = [];
    const chainObj = chainConfig.find(
      (item) => item.wagmiId === chain?.id
    )!

    const tokenList = getAcceptedDepositAssetsByChain(chainObj.id);

    await Promise.all(tokenList.map(async (token) => {
      try {
        const result = await readContracts(wagmiConfig, {
          allowFailure: false,
          contracts: [
            {
              address: token?.symbol !== 'ETH' ? getAddress(token!.address) : undefined,
              abi: erc20Abi,
              functionName: 'balanceOf',
              args: [getAddress(address!)]
            },
            {
              address: token?.symbol !== 'ETH' ? getAddress(token!.address) : undefined,
              abi: erc20Abi,
              functionName: 'decimals'
            },
            {
              address: token?.symbol !== 'ETH' ? getAddress(token!.address) : undefined,
              abi: erc20Abi,
              functionName: 'symbol'
            },
          ]
        })
        const balance: Balance = {
          value: result[0] as bigint,
          decimals: result[1] as number,
          symbol: result[2] as string,
          formatted: formatUnits(result[0], result[1]),
          valueInUSD: 0
        }
        console.log(balance);

        if (balance.value !== 0n) {
          // fix because token comes with different naming
          if (balance.symbol === 'B-rETH-STABLE'){
            balance.symbol = 'rETH BPT'
          }
          const price = await fetchCoingeckoPrice(
            token!,
            "usd"
          );
          const valueInUSD = Number(balance.formatted) * Number(price || 0);
          depositAssetBalances.push({...balance, valueInUSD});
        }
      } catch (error) {
        console.error("error", error);
      }
    }));
    depositAssetBalances.sort(
      (x, y) => y.valueInUSD - x.valueInUSD
    );

    return depositAssetBalances;
  }

  const query = useQuery({
    queryKey: ["USE_USER_BALANCES"],
    queryFn: async () => {
      return await fetchBalances()
    }
  }
  )

  return {
    userBalances: query
  }
}
