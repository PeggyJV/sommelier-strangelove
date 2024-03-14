import React, { useEffect, useState } from "react"
import { Box, Text, VStack } from "@chakra-ui/react"
import { fetchEtherfiData } from "utils/fetchEtherfiData"

// Placeholder function for fetching Eigenlayer data
// Implement it similarly to fetchEtherfiData
async function fetchEigenlayerData(userAddress: string) {
  // Replace this with actual API call to fetch Eigenlayer points
  return { eigenlayerPoints: 0 } // placeholder
}

interface PointsDisplayProps {
  userAddress: string
}

const PointsDisplay: React.FC<PointsDisplayProps> = ({
  userAddress,
}) => {
  const [etherfiPoints, setEtherfiPoints] = useState<number | null>(
    null
  )
  const [eigenlayerPoints, setEigenlayerPoints] = useState<
    number | null
  >(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const etherfiData = await fetchEtherfiData(userAddress)
        setEtherfiPoints(etherfiData.points) // adjust according to actual data structure

        const eigenlayerData = await fetchEigenlayerData(userAddress)
        setEigenlayerPoints(eigenlayerData.eigenlayerPoints) // adjust according to actual data structure
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
