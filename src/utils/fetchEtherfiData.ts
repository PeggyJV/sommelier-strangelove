import axios from "axios"

const API_BASE_URL = "https://api.sommelier.finance/etherfi/ethereum/"

export const fetchEtherfiData = async (userAddress: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}${userAddress}`)
    return response.data
  } catch (error) {
    console.error("Failed to fetch Etherfi data:", error)
    throw error
  }
}
