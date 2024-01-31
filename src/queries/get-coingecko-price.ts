import { queryContract } from "context/rpc_context"
import pricerouterAbi from "src/abi/pricerouterAbi.json"
import { Token } from "src/data/tokenConfig"
import { chainConfigMap } from "data/chainConfig"

const getUrl = (baseId: string, quoteId: string) =>
  `/api/coingecko-simple-price?base=${baseId}&quote=${quoteId}`

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
      console.error("No price found: ", result, "\n\ntrying price router...")
      throw new Error("No price found")
    }

    return result.price + ""
  } catch (error) {
    console.log("Error fetching Coingecko Price for token: ", token, "\n\ntrying price router...")

    const chain = chainConfigMap[token.chain]

    let priceRouterContract = await queryContract(
      chain.priceRouterAddress,
      pricerouterAbi,
      chain
    )

    if (!priceRouterContract) {
      console.error("No price router contract found on chain: " + token.chain)
      throw new Error("No price router contract found on chain: " + token.chain)
    }
      

    const price = await priceRouterContract.getPriceInUSD(
      token.address
    )

    if (price) {
      return (price / 10 ** 8).toString()
    }

    throw new Error("Price router could not price: " + token)
  }
}