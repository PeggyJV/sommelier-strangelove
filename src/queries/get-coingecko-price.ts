import { queryContract } from "context/rpc_context"
import pricerouterAbi from "src/abi/price-router.json"
import { Token } from "src/data/tokenConfig"
import { chainConfigMap } from "data/chainConfig"

const getUrl = (baseId: string, quoteId: string) =>
  `/api/coingecko-simple-price?base=${baseId}&quote=${quoteId}`

// Emergency fallback prices when both CoinGecko and Price Router fail
// These are approximate and used only to allow UI to load
const EMERGENCY_FALLBACK_PRICES: Record<string, string> = {
  // ETH and variants
  weth: "3300",
  ethereum: "3300",
  "staked-ether": "3300",
  "wrapped-steth": "3300",
  "lido-staked-ether": "3300",
  "rocket-pool-eth": "3500",
  "coinbase-wrapped-staked-eth": "3400",
  "renzo-restaked-eth": "3300",
  "kelp-dao-restaked-eth": "3300",
  "ether-fi-staked-eth": "3300",
  "wrapped-eeth": "3400",
  sweth: "3300",
  "stader-ethx": "3300",
  // Stablecoins
  "usd-coin": "1",
  "usd-coin-ethereum-bridged": "1",
  usdc: "1",
  tether: "1",
  dai: "1",
  frax: "1",
  gho: "1",
  "liquity-usd": "1",
  // BTC
  "wrapped-bitcoin": "100000",
  // DeFi tokens
  sommelier: "0.0005",
  uniswap: "12",
  chainlink: "20",
  "1inch": "0.4",
  "ethereum-name-service": "30",
  havven: "2", // SNX
  "matic-network": "0.4",
  aave: "250",
  "compound-governance-token": "60",
  "curve-dao-token": "0.8",
  "lido-dao": "2",
  maker: "1500",
  // LP tokens - use approximate underlying value
  "b-reth-stable": "3400",
  "y-eth": "3300",
  "y-usd": "1",
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
