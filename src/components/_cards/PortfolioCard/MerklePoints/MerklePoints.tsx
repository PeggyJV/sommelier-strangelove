import React, { useEffect, useState } from "react"
import { CardStat } from "components/CardStat"
import { fetchMerkleData } from "utils/fetchMerkleData"
import { BaseButton } from "components/_buttons/BaseButton"
import { ethers } from "ethers"
import { ExternalProvider } from "@ethersproject/providers"
import merkleABI from "../../../../abi/merkle.json"
import { useBrandedToast } from "hooks/chakra"
import { Text, Box } from "@chakra-ui/react"

const MERKLE_CONTRACT_ADDRESS =
  "0x6D6444b54FEe95E3C7b15C69EfDE0f0EB3611445"

interface MerklePointsProps {
  userAddress: string
  merkleRewardsApy?: number
}

const formatPoints = (points: string): string => {
  const number = parseFloat(points)
  if (number >= 1e9) {
    return `${(number / 1e9).toFixed(2)}B`
  } else if (number >= 1e6) {
    return `${(number / 1e6).toFixed(2)}M`
  } else if (number >= 1e3) {
    return `${(number / 1e3).toFixed(2)}K`
  } else {
    return number.toFixed(2)
  }
}

export const MerklePoints = ({
  userAddress,
  merkleRewardsApy,
}: MerklePointsProps) => {
  const [merklePoints, setMerklePoints] = useState<string | null>(
    null
  )
  const [merkleData, setMerkleData] = useState<any>(null)
  const { addToast, close } = useBrandedToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchMerkleData(userAddress)
        if (response.Response && response.Response.total_balance) {
          const formatted = ethers.utils.formatUnits(
            response.Response.total_balance,
            0
          )
          setMerklePoints(formatted)
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

  const isHexString = (value: string) =>
    /^0x[0-9a-fA-F]+$/.test(value)

  const ensureHexPrefix = (value: string) =>
    value.startsWith("0x") ? value : `0x${value}`

  const handleClaimMerklePoints = async () => {
    if (window.ethereum && merkleData) {
      try {
        await window.ethereum.request({
          method: "eth_requestAccounts",
        })
        const provider = new ethers.providers.Web3Provider(
          window.ethereum as ExternalProvider
        )
        const signer = provider.getSigner()
        const contract = new ethers.Contract(
          MERKLE_CONTRACT_ADDRESS,
          merkleABI,
          signer
        )

        const hasClaimed = await contract.claimed(
          ethers.utils.keccak256(
            ethers.utils.arrayify(
              ensureHexPrefix(merkleData.rootHashes[0])
            )
          ),
          userAddress
        )
        if (hasClaimed) {
          console.log("Claim has already been made")
          addToast({
            heading: "Claim Info",
            status: "info",
            body: <Text>Claim has already been made</Text>,
            closeHandler: close,
            duration: null,
          })
          return
        }

        console.log("Merkle Data:", merkleData)

        const rootHashes = merkleData.rootHashes.map(
          (hash: string) => {
            const prefixedHash = ensureHexPrefix(hash)
            if (!isHexString(prefixedHash)) {
              throw new Error(`Invalid hex string: ${prefixedHash}`)
            }
            return ethers.utils.arrayify(prefixedHash)
          }
        )

        const merkleProofs = merkleData.merkleProofs.map(
          (proofArray: string[]) =>
            proofArray.map((proof: string) => {
              const prefixedProof = ensureHexPrefix(proof)
              if (!isHexString(prefixedProof)) {
                throw new Error(
                  `Invalid hex string: ${prefixedProof}`
                )
              }
              return ethers.utils.arrayify(prefixedProof)
            })
        )

        const tx = await contract.claim(
          userAddress, // _to
          rootHashes, // _rootHashes
          merkleData.tokens, // _tokens
          merkleData.balances, // _balances
          merkleProofs // _merkleProofs
        )

        await tx.wait()
        console.log("Claim successful")
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
            (error as any).code ===
            ethers.errors.UNPREDICTABLE_GAS_LIMIT
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
        {merklePoints ? formatPoints(merklePoints) : "Loading..."}
      </CardStat>
      <BaseButton onClick={handleClaimMerklePoints}>
        Claim Merkle Rewards
      </BaseButton>
    </>
  )
}
