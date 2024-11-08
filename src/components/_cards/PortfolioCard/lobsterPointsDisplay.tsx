import React, { useEffect, useState } from "react"
import { CardStat } from "components/CardStat" 
import { fetchLobsterPoints } from "utils/fetchLobsterPoints" // Ensure this function is properly exported in the utils file

// Define the props type for LobsterPointsDisplay
interface LobsterPointsDisplayProps {
  userAddress: string
}

// Define the LobsterPointsDisplay component
export const LobsterPointsDisplay: React.FC<LobsterPointsDisplayProps> = ({
  userAddress,
}) => {
  const [lobsterPoints, setLobsterPoints] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchLobsterPoints(userAddress)
        if (response) {
          // Assuming response contains a field for points, e.g., response.user_points
          const formattedLobsterPoints = Number(response.user_points).toFixed(2)
          setLobsterPoints(formattedLobsterPoints)
        }
      } catch (error) {
        console.error("Failed to fetch Lobster points data:", error)
      }
    }

    fetchData()
  }, [userAddress])

  return (
    <CardStat
      label="Lobster Points"
      tooltip="The number of Lobster points accumulated"
      alignSelf="flex-start"
      spacing={0}
    >
      {lobsterPoints ?? "Loading..."}
    </CardStat>
  )
}
