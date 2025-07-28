import axios from "axios"

const API_BASE_URL = "https://api.sommelier.finance/merkle/"

export const fetchMerkleData = async (
  vaultAddress: string,
  userAddress: string,
  chain: string
) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}${chain}/${vaultAddress}/${userAddress}`
    )
    return response.data
  } catch (error) {
    console.error("Failed to fetch Merkle data:", error)
    throw error
  }
}
