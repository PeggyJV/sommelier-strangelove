import React, { useEffect, useState } from "react"
import { CardStat } from "components/CardStat"
import { fetchMerkleData } from "utils/fetchMerkleData"
import { BaseButton } from "components/_buttons/BaseButton"
import { useBrandedToast } from "hooks/chakra"
import { Text, Box } from "@chakra-ui/react"
import { MerkleRewards } from "../../../../abi/types/MerkleRewards"
import { usePublicClient, useWalletClient } from "wagmi"
import { getContract, isHex, keccak256, toBytes } from "viem"

const MERKLE_CONTRACT_ADDRESS = "0x6D6444b54FEe95E3C7b15C69EfDE0f0EB3611445"
interface MerklePointsProps {
  userAddress: string,
  merkleRewardsApy?: number
}

export const MerklePoints = ({
  userAddress, merkleRewardsApy
}: MerklePointsProps) => {
  const [merklePoints, setMerklePoints] = useState<string | null>(
    null
  )
  const [merkleData, setMerkleData] = useState<any>(null)
  const { addToast, close } = useBrandedToast()

  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchMerkleData(userAddress)
        if (response.Response && response.Response.total_balance) {
          setMerklePoints(response.Response.total_balance)
          setMerkleData(response.Response.tx_data)
        } else {
          setMerklePoints("0")
        }
      } catch (error) {
        console.error("Failed to fetch Merkle points data:", error)
        addToast({
          heading: "Error fetching data",
          status: "error",
          body: (
            <Text>
              Failed to fetch Merkle points data:{" "}
              {(error as Error).message}
            </Text>
          ),
          closeHandler: close,
          duration: null,
        })
        setMerklePoints("0")
      }
    }

    fetchData()
  }, [])

  const ensureHexPrefix = (value: string) =>
    value.startsWith("0x") ? value : `0x${value}`

  const handleClaimMerklePoints = async () => {
    if (merkleData && publicClient) {
      try {
        const merkleRewardsContract = getContract({
          address: MERKLE_CONTRACT_ADDRESS,
          abi: MerkleRewards,
          client:  {
            wallet: walletClient,
            public: publicClient
          }
        })

        // Check if the claim has already been made
        const hasClaimed = await merkleRewardsContract.read.claimed([
            keccak256(
              toBytes(
                ensureHexPrefix(merkleData.rootHashes[0])
              )
            ) as `0x${string}`,
            userAddress as `0x${string}`
          ]
        )
        if (hasClaimed) {
          addToast({
            heading: "Claim Info",
            status: "info",
            body: <Text>Claim has already been made</Text>,
            closeHandler: close,
            duration: null,
          })
          return
        }

        const rootHashes = merkleData.rootHashes.map(
          (hash: string) => {
            const prefixedHash = ensureHexPrefix(hash)
            if (!isHex(prefixedHash)) {
              throw new Error(`Invalid hex string: ${prefixedHash}`)
            }
            return toBytes(prefixedHash)
          }
        )

        const merkleProofs = merkleData.merkleProofs.map(
          (proofArray: string[]) =>
            proofArray.map((proof: string) => {
              const prefixedProof = ensureHexPrefix(proof)
              if (!isHex(prefixedProof)) {
                throw new Error(
                  `Invalid hex string: ${prefixedProof}`
                )
              }
              return toBytes(prefixedProof)
            })
        )

        // @ts-ignore
        const tx = await merkleRewardsContract.write.claim([
          userAddress,
          rootHashes,
          merkleData.tokens,
          merkleData.balances,
          merkleProofs
          ]
        )

        await tx.wait()
        addToast({
          heading: "Success",
          status: "success",
          body: <Text>Claim successful</Text>,
          closeHandler: close,
          duration: null,
        })
      } catch (error) {
        if (error instanceof Error && "code" in error) {
          if (
            (error as any).code === 'UNPREDICTABLE_GAS_LIMIT'
          ) {
            console.error(
              "Claim failed: It has already been claimed or another error occurred",
              error
            )
            addToast({
              heading: "Claim Failed",
              status: "error",
              body: (
                <Text>
                  Claim failed: It has already been claimed or another
                  error occurred
                </Text>
              ),
              closeHandler: close,
              duration: null,
            })
          } else {
            console.error("Claim failed:", error)
            addToast({
              heading: "Claim Failed",
              status: "error",
              body: (
                <Text>Claim failed: {(error as Error).message}</Text>
              ),
              closeHandler: close,
              duration: null,
            })
          }
        } else {
          console.error("An unknown error occurred:", error)
          addToast({
            heading: "Unknown Error",
            status: "error",
            body: (
              <Text>
                An unknown error occurred: {(error as Error).message}
              </Text>
            ),
            closeHandler: close,
            duration: null,
          })
        }
      }
    } else {
      console.error("Web3 provider not found or no merkle data")
      addToast({
        heading: "Error",
        status: "error",
        body: <Text>Web3 provider not found or no merkle data</Text>,
        closeHandler: close,
        duration: null,
      })
    }
  }

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
      <BaseButton onClick={handleClaimMerklePoints}>
        Claim Merkle Rewards
      </BaseButton>
      <Box>
        <Text fontSize="xl" fontWeight="bold">
          Merkle Points APY: {merkleRewardsApy ? `${merkleRewardsApy.toFixed(2)}%` : "N/A"}
        </Text>
      </Box>
    </>
  )
}
