import { queryContract } from "context/rpc_context"
import { chainConfigMap } from "data/chainConfig"
import { tokenConfig } from "data/tokenConfig"
import priceRouterAbi from "src/abi/price-router.json"

const getUrl = (baseId: string, quoteId: string) =>
  `/api/coingecko-simple-price?base=${baseId}&quote=${quoteId}`

export const fetchCoingeckoPrice = async (
  base: string,
  quote: string
) => {
  const baseId = base.toLowerCase()
  const quoteId = quote.toLowerCase()
  const url = getUrl(baseId, quoteId)

  try {
    const data = await fetch(url)
    const result = await data.json()

    if (result.price === undefined) {
      return await fetchPriceFromContract(base)
    }

    return result.price + ""
  } catch (error) {
    console.log("Error fetching Price", error)
    throw Error(error as string)
  }
}

const fetchPriceFromContract = async (base: string) => {
  const contractAddress = "0xA1A0bc3D59e4ee5840c9530e49Bdc2d1f88AaF92"
  const token = tokenConfig.find(token => token.coinGeckoId === base)

  if(token === undefined){
    throw Error("Token is undefined")
  }

  const chain = chainConfigMap[token.chain]
  const tokenAddress = token.address

  const contract = await queryContract(
    contractAddress,
    priceRouterAbi,
    chain
  );

  if(contract === null){
    throw Error("Contract is null")
  }
  const priceInUSD = await contract.getPriceInUSD(tokenAddress)

  return (priceInUSD / 1e8).toString()
}
