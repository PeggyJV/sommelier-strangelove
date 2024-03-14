import React, { useEffect, useState } from "react"
import { Box, Text, VStack } from "@chakra-ui/react"
import { fetchEtherfiData } from "utils/fetchEtherfiData" // Adjust the import path as necessary

// Placeholder function for fetching Eigenlayer data, you might already have a real implementation
async function fetchEigenlayerData(userAddress: string) {
  // Since your example API response structure includes eigenlayerPoints, you might want to use the same API call here
  // Assuming fetchEtherfiData function is supposed to fetch this data, consider renaming or adjusting functionality as needed
  // This placeholder is here for demonstration purposes
  return fetchEtherfiData(userAddress) // This is a placeholder, adjust according to your actual data fetching logic
}

interface PointsDisplayProps {
  userAddress: string
}

const PointsDisplay: React.FC<PointsDisplayProps> = ({
  userAddress,
}) => {
  const [etherfiPoints, setEtherfiPoints] = useState<string | null>(
    null
  )
  const [eigenlayerPoints, setEigenlayerPoints] = useState<
    string | null
  >(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Assuming fetchEtherfiData is meant to fetch both etherfi and eigenlayer points
        const response = await fetchEtherfiData(userAddress)
        if (response.Response) {
          // Adjust these lines based on the actual keys and data structure
          setEtherfiPoints(response.Response.loyaltyPoints)
          setEigenlayerPoints(response.Response.eigenlayerPoints)
        }
      } catch (error) {
        console.error("Failed to fetch points data:", error)
      }
    }

    fetchData()
  }, [userAddress])

  return (
    <VStack>
      <Box>
        <Text>Etherfi Points: {etherfiPoints ?? "Loading..."}</Text>
      </Box>
      <Box>
        <Text>
          Eigenlayer Points: {eigenlayerPoints ?? "Loading..."}
        </Text>
      </Box>
    </VStack>
  )
}

export default PointsDisplay
