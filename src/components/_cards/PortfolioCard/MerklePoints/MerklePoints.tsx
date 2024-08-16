import React, { useEffect, useState } from "react"
import { CardStat } from "components/CardStat"
import { BaseButton } from "components/_buttons/BaseButton"
import { useBrandedToast } from "hooks/chakra"
import { Text, VStack } from "@chakra-ui/react"
import { MerkleRewards } from "../../../../abi/types/MerkleRewards"
import { usePublicClient, useWalletClient, useAccount } from "wagmi"
import {
  formatUnits,
  getAddress,
  getContract,
  isHex,
  keccak256,
  toBytes,
} from "viem"
import { useWaitForTransaction } from "hooks/wagmi-helper/useWaitForTransactions"
import { ConfigProps } from "data/types"
import { fetchMerkleData } from "utils/fetchMerkleData"

const MERKLE_CONTRACT_ADDRESS =
  "0x6D6444b54FEe95E3C7b15C69EfDE0f0EB3611445"

interface MerklePointsProps {
  userAddress?: `0x${string}`
  cellarConfig: ConfigProps
}

export const MerklePoints = ({
  userAddress,
  cellarConfig,
}: MerklePointsProps) => {
  const [merklePoints, setMerklePoints] = useState<string | null>(
    null
  )
  const [merkleData, setMerkleData] = useState<any>(null)
  const { addToast, close } = useBrandedToast()

  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient()
  const { chain, address } = useAccount()

  const [_, wait] = useWaitForTransaction({
    skip: true,
  })

  useEffect(() => {
    if (userAddress) {
      const fetchData = async () => {
        try {
          const response = await fetchMerkleData(
            cellarConfig.cellar.address,
            address ?? "",
            cellarConfig.chain.id
          );

          if (response.Response) {
            const totalBalance = response.Response.total_balance;
            if (totalBalance && parseFloat(totalBalance) > 0) {
              // Convert and round the balance to two decimal places
              const roundedBalance = parseFloat(formatUnits(BigInt(totalBalance), 18)).toFixed(2);
              setMerklePoints(roundedBalance);
              setMerkleData(response.Response.tx_data);
            } else {
              setMerklePoints("0.00");
              setMerkleData(null);
            }
          } else {
            setMerklePoints("0.00");
            setMerkleData(null);
          }
        } catch (error) {
          console.error("Failed to fetch Merkle points data:", error);
          addToast({
            heading: "Error fetching data",
            status: "error",
            body: (
              <Text>
                Failed to fetch Merkle points data: {(error as Error).message}
              </Text>
            ),
            closeHandler: close,
            duration: null,
          });
          setMerklePoints("0.00");
          setMerkleData(null);
        }
      };

      fetchData();
    } else {
      setMerklePoints(null);
      setMerkleData(null);
    }
  }, [userAddress]);


  const ensureHexPrefix = (value: string) =>
    value?.startsWith("0x") ? value : `0x${value}`

  const handleClaimMerklePoints = async () => {
    if (!walletClient) {
      addToast({
        heading: "Wallet Not Connected",
        status: "error",
        body: (
          <Text>
            Please connect your wallet to claim Merkle rewards.
          </Text>
        ),
        closeHandler: close,
        duration: null,
      })
      return
    }

    if (merkleData && publicClient) {
      try {
        const merkleRewardsContract = getContract({
          address: MERKLE_CONTRACT_ADDRESS,
          abi: MerkleRewards,
          client: walletClient,
        })

        const hasClaimed = await merkleRewardsContract.read.claimed([
          keccak256(
            toBytes(ensureHexPrefix(merkleData.rootHashes[0]))
          ),
          getAddress(userAddress ?? ""),
        ])
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
            return prefixedHash
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
              return prefixedProof
            })
        )
        // @ts-ignore
        const hash = await merkleRewardsContract.write.claim([
          getAddress(userAddress ?? ""),
          rootHashes,
          merkleData.tokens,
          merkleData.balances,
          merkleProofs,
        ])

        const waitForResult = wait({ confirmations: 1, hash })
        const result = await waitForResult

        if (result?.data?.transactionHash) {
          addToast({
            heading: "Success",
            status: "success",
            body: <Text>Claim successful</Text>,
            closeHandler: close,
            duration: null,
          })
          setMerklePoints("0.00");
          setMerkleData(null);
        } else {
          addToast({
            heading: "Transaction Failed",
            status: "error",
            body: <Text>Claim failed</Text>,
            closeHandler: close,
            duration: null,
          })
        }
      } catch (error) {
        if (error instanceof Error) {
          if ("code" in error &&
              (error as any).code === "UNPREDICTABLE_GAS_LIMIT") {
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
            // @ts-ignore
            const code = error.cause.code
            if (code === 4001) {
              // @ts-ignore
              const message = error.cause.message;
              console.error("Claim failed:", error)

              addToast({
                heading: "Claim Failed",
                status: "error",
                body: (
                  <Text>Claim failed: {message}</Text>
                ),
                closeHandler: close,
                duration: null,
              })
            }else {
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
    <VStack spacing={4} alignItems="flex-start">
      <CardStat
        label={`Merkle ${cellarConfig.chain.id === "abitrum" ? "ARB" : "OP"} Rewards`}
        tooltip={`After claiming your rewards, please check to see if you shares are bonded to be eligible for the next set of ${cellarConfig.chain.id === "abitrum" ? "ARB" : "OP"} rewards. New users should bond to receive rewards.`}
        alignSelf="flex-start"
        spacing={0}
      >
        {
          userAddress && merklePoints !== null
            ? merklePoints
            : "--"
        }
      </CardStat>

      <BaseButton
        onClick={handleClaimMerklePoints}
        isDisabled={
          !userAddress ||
          merklePoints === null ||
          merklePoints === "0.00" ||
          (cellarConfig.chain.id === "abitrum" && chain?.id !== 42161) ||  // Disable if not on Arbitrum chain
          (cellarConfig.chain.id === "optimism" && chain?.id !== 10) // Disable if not on on Optimism chain
        }
      >
        Claim Merkle Rewards
      </BaseButton>
    </VStack>
  )
}
