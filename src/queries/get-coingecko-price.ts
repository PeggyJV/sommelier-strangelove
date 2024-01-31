import { queryContract } from "context/rpc_context"
import { chainConfigMap } from "data/chainConfig"
import someContractAbi from "src/abi/pricerouterAbi.json"
import { Contract } from "ethers"

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

    return result.price ? result.price + "" : undefined
  } catch (error) {
    console.log("Error fetching Coingecko Price", error)
    return getPriceFromEtherScan(base)
  }
}

export const getPriceFromEtherScan = async (base: string) => {
  const contractAddress = "0xA1A0bc3D59e4ee5840c9530e49Bdc2d1f88AaF92"
  const contract = (await queryContract(
    contractAddress,
    someContractAbi,
    chainConfigMap["ethereum"]
  )) as unknown as SomeContract
  const priceInUSD = await contract.getPriceInUSD(base)
  return priceInUSD / 1e8
}
interface SomeContract extends Contract {
  getPriceInUSD(base: string): Promise<number>
}
