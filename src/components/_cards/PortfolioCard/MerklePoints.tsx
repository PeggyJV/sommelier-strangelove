import React, { useEffect, useState } from "react"
import { CardStat } from "components/CardStat"
import { fetchMerkleData } from "utils/fetchMerkleData"
import { BaseButton } from "components/_buttons/BaseButton"
import { ethers } from "ethers" // Import ethers library
import { ExternalProvider } from "@ethersproject/providers"
import merkleABI from "../../../abi/merkle.json" // Import Merkle contract ABI

const contractAddress = "0x6D6444b54FEe95E3C7b15C69EfDE0f0EB3611445" // Merkle Rewards contract address

interface MerklePointsProps {
  userAddress: string
}

export const MerklePoints: React.FC<MerklePointsProps> = ({
  userAddress,
}) => {
  const [merklePoints, setMerklePoints] = useState<string | null>(
    null
  )
  const [merkleData, setMerkleData] = useState<any>(null)

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
        setMerklePoints("0")
      }
    }

    fetchData()
  }, [userAddress])

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
          contractAddress,
          merkleABI,
          signer
        )

        // Check if the claim has already been made
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
          return
        }

        // Log merkleData for debugging
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
          } else {
            console.error("Claim failed:", error)
          }
        } else {
          console.error("An unknown error occurred:", error)
        }
      }
    } else {
      console.error("Web3 provider not found or no merkle data")
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
    </>
  )
}
