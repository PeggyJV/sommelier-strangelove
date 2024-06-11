import React, { useEffect, useState } from "react"
import { CardStat } from "components/CardStat"
import { fetchMerkleData } from "utils/fetchMerkleData"

interface MerklePointsProps {
  userAddress: string
}

export const MerklePoints: React.FC<MerklePointsProps> = ({
  userAddress,
}) => {
  const [merklePoints, setMerklePoints] = useState<string | null>(
    null
  )

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchMerkleData(userAddress)
        if (response.Response && response.Response.total_balance) {
          setMerklePoints(response.Response.total_balance)
        } else {
          setMerklePoints("0")
        }
      } catch (error) {
        console.error("Failed to fetch Merkle points data:", error)
        setMerklePoints("0")
      }
    }

    fetchData()
  }, [userAddress])

  return (
    <>
      <CardStat
        label="Merkle Points"
        tooltip="The number of Merkle points accumulated. Please note that you will only receive ARB rewards if you also stake your shares in the SOMM staking contract."
        alignSelf="flex-start"
        spacing={0}
      >
        {merklePoints ?? "Loading..."}
      </CardStat>
    </>
  )
}
