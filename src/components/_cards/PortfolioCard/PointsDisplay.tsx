import React, { useEffect, useState } from "react"
import { CardStat } from "components/CardStat" // Ensure this path is correct
import { fetchEtherfiData } from "utils/fetchEtherfiData" // Adjust the import path as necessary

// Assuming fetchEtherfiData fetches the necessary data
async function fetchEigenlayerData(userAddress: string) {
  return fetchEtherfiData(userAddress)
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
        const response = await fetchEtherfiData(userAddress)
        if (response.Response) {
          // Format points with two decimal places
          const formattedEtherfiPoints = Number(
            response.Response.loyaltyPoints
          ).toFixed(2)
          const formattedEigenlayerPoints = Number(
            response.Response.eigenlayerPoints
          ).toFixed(2)

          setEtherfiPoints(formattedEtherfiPoints)
          setEigenlayerPoints(formattedEigenlayerPoints)
        }
      } catch (error) {
        console.error("Failed to fetch points data:", error)
      }
    }

    fetchData()
  }, [userAddress])

  return (
    <>
      <CardStat
        label="Etherfi Points"
        tooltip="The number of Etherfi points accumulated"
        alignSelf="flex-start"
        spacing={0}
      >
        {etherfiPoints ?? "Loading..."}
      </CardStat>
      <CardStat
        label="Eigenlayer Points"
        tooltip="The number of Eigenlayer points accumulated"
        alignSelf="flex-start"
        spacing={0}
      >
        {eigenlayerPoints ?? "Loading..."}
      </CardStat>
    </>
  )
}

export default PointsDisplay
