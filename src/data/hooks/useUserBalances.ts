import { getAcceptedDepositAssetsByChain } from "data/tokenConfig"
import { ResolvedRegister } from "abitype"
import { erc20Abi, formatUnits } from "viem"
import { useAccount, usePublicClient } from "wagmi"
import { chainConfig } from "data/chainConfig"
import { fetchCoingeckoPrice } from "queries/get-coingecko-price"
import { useQuery } from "@tanstack/react-query"

type Balance = {
  decimals: ResolvedRegister["IntType"]
  formatted: string
  symbol: string
  value: ResolvedRegister["BigIntType"]
  valueInUSD: number
}

export const useUserBalances = () => {
  const { address, chain } = useAccount()
  const publicClient = usePublicClient()

  const fetchBalances = async () => {
    const depositAssetBalances: Balance[] = []
    const chainObj = chainConfig.find(
      (item) => item.wagmiId === chain?.id
    )!

    const tokenList = getAcceptedDepositAssetsByChain(chainObj.id)

    await Promise.all(
      tokenList.map(async (token) => {
        if (!token || !address) {
          return
        }
        try {
          if (!publicClient) return
          
          let balance
          if (token?.symbol === "ETH") {
            balance = await publicClient.getBalance({
              address: address,
            })
          } else {
            const result = await publicClient.multicall({
              contracts: [
                {
                  address: token.address as `0x${string}`,
                  abi: erc20Abi,
                  functionName: "balanceOf",
                  args: [address],
                },
              ],
            })

            // Guard against undefined/null results
            const balanceResult = result[0]?.result
            if (balanceResult === null || balanceResult === undefined) {
              console.warn(`Balance result is null/undefined for token ${token.symbol}`)
              return
            }

            balance = {
              value: balanceResult as bigint,
              decimals: token.decimals,
              symbol: token.symbol,
              formatted: formatUnits(balanceResult as bigint, token.decimals),
              valueInUSD: 0,
            }
          }

          if (typeof balance === 'bigint') {
            // Handle native ETH balance
            if (balance !== 0n) {
              const price = await fetchCoingeckoPrice(token!, "usd")
              const valueInUSD = Number(formatUnits(balance, 18)) * Number(price || 0)
              depositAssetBalances.push({
                value: balance,
                decimals: 18,
                symbol: "ETH",
                formatted: formatUnits(balance, 18),
                valueInUSD,
              })
            }
          } else if (balance.value !== 0n) {
            // Handle ERC20 token balance
            // fix because token comes with different naming
            if (balance.symbol === "B-rETH-STABLE") {
              balance.symbol = "rETH BPT"
            }
            const price = await fetchCoingeckoPrice(token!, "usd")
            const valueInUSD =
              Number(balance.formatted) * Number(price || 0)
            depositAssetBalances.push({ ...balance, valueInUSD })
          }
        } catch (error) {
          console.error("error", error)
        }
        return
      })
    )
    depositAssetBalances.sort((x, y) => y.valueInUSD - x.valueInUSD)

    return depositAssetBalances
  }

  const query = useQuery({
    queryKey: ["USE_USER_BALANCES", address, chain?.id],
    queryFn: async () => {
      return await fetchBalances()
    },
    enabled: Boolean(publicClient && address && chain),
  })

  return {
    userBalances: query,
  }
}
