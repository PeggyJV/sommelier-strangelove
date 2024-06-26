import { getAcceptedDepositAssetsByChain } from "data/tokenConfig"
import { ResolvedRegister } from "abitype"
import { getBalance, readContracts } from "@wagmi/core"
import { erc20Abi, formatUnits } from "viem"
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
      if (!token || !address) {
        return depositAssetBalances;
      }
      try {
        let balance;
        if (token?.symbol === 'ETH') {
          balance = await getBalance(wagmiConfig, {
            address: address,
          })
        }
        else {
          const result = await readContracts(wagmiConfig, {
            allowFailure: false,
            contracts: [
              {
                address: token.address as `0x${string}`,
                abi: erc20Abi,
                functionName: 'balanceOf',
                args: [address]
              }
            ]
          })

          balance = {
            value: result[0] as bigint,
            decimals: token.decimals,
            symbol: token.symbol,
            formatted: formatUnits(result[0], token.decimals),
            valueInUSD: 0
          }
        }

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
