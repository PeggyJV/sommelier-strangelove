import { queryContract } from "context/rpc_context"
import pricerouterAbi from "src/abi/price-router.json"
import { Token } from "src/data/tokenConfig"
import { chainConfigMap } from "data/chainConfig"

const getUrl = (baseId: string, quoteId: string) =>
  `/api/coingecko-simple-price?base=${baseId}&quote=${quoteId}`

// Emergency fallback prices when both CoinGecko and Price Router fail
// These are approximate and used only to allow UI to load
const EMERGENCY_FALLBACK_PRICES: Record<string, string> = {
  weth: "3000",
  ethereum: "3000",
  "wrapped-steth": "3000",
  "lido-staked-ether": "3000",
  "usd-coin": "1",
  usdc: "1",
  tether: "1",
  dai: "1",
  "wrapped-bitcoin": "100000",
  sommelier: "0.0005",
}

export const fetchCoingeckoPrice = async (
  token: Token,
  quote: string
) => {
  const baseId = token.coinGeckoId.toLowerCase()
  const quoteId = quote.toLowerCase()
  const url = getUrl(baseId, quoteId)

  try {
    const data = await fetch(url)
    const result = await data.json()

    if (!result.price) {
      throw new Error("No price found")
    }

    return result.price + ""
  } catch (error) {
    // Try Price Router as fallback
    try {
      const chain = chainConfigMap[token.chain]

      let priceRouterContract = await queryContract(
        chain.priceRouterAddress,
        pricerouterAbi,
        chain
      )

      if (priceRouterContract) {
        const price = await priceRouterContract.read.getPriceInUSD(
          [token.address]
        )

        if (price) {
          return (Number(price) / 10 ** 8).toString()
        }
      }
    } catch (priceRouterError) {
      console.warn(
        `Price Router fallback failed for ${token.coinGeckoId}:`,
        priceRouterError
      )
    }

    // Final fallback: use emergency hardcoded prices
    const fallbackPrice = EMERGENCY_FALLBACK_PRICES[baseId]
    if (fallbackPrice) {
      console.warn(
        `Using emergency fallback price for ${token.coinGeckoId}: $${fallbackPrice}`
      )
      return fallbackPrice
    }

    throw new Error(`Could not price token: ${token.coinGeckoId}`)
  }
}
