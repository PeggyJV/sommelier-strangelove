import React, { useEffect, useState } from "react"
import { CardStat } from "components/CardStat" // Adjust the import path as necessary
import { fetchEtherfiData } from "utils/fetchEtherfiData" // Adjust the import path as necessary

interface PointsDisplayProps {
  userAddress: string
}

export const PointsDisplay: React.FC<PointsDisplayProps> = ({
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
          // Assuming response.Response contains the necessary data
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
        label="Ether.fi Points"
        tooltip="The number of Ether.fi points accumulated"
        alignSelf="flex-start"
        spacing={0}
      >
        {etherfiPoints ?? "Loading..."}
      </CardStat>
      <CardStat
        label="EigenLayer Points"
        tooltip="The number of EigenLayer points accumulated"
        alignSelf="flex-start"
        spacing={0}
      >
        {eigenlayerPoints ?? "Loading..."}
      </CardStat>
    </>
  )
}
