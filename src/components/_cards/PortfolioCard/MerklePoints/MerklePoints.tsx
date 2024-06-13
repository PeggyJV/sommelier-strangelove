import React, { useEffect, useState } from "react"
import { CardStat } from "components/CardStat"
import { fetchMerkleData } from "utils/fetchMerkleData"
import { BaseButton } from "components/_buttons/BaseButton"
import { ethers } from "ethers"
import { ExternalProvider } from "@ethersproject/providers"
import merkleABI from "../../../../abi/merkle.json"
import { useBrandedToast } from "hooks/chakra"
import { Text, Box, Spinner } from "@chakra-ui/react"
import axios from "axios"
import { ConfigProps } from "data/types"
import { useCreateContracts } from "data/hooks/useCreateContracts"

const MERKLE_CONTRACT_ADDRESS = "0x6D6444b54FEe95E3C7b15C69EfDE0f0EB3611445"

const ARB_TOKENS_IN_PERIOD = 30000 // 30,000 ARB tokens
const PERIOD_DAYS = 7 // 7 days

const COINGECKO_API_URL =
  "https://api.coingecko.com/api/v3/simple/price"
const ARB_ID = "arbitrum"
const ETH_ID = "ethereum"

const fetchPrice = async (tokenId: string) => {
  try {
    const response = await axios.get(COINGECKO_API_URL, {
      params: {
        ids: tokenId,
        vs_currencies: "usd",
      },
    })
    return response.data[tokenId]?.usd || 0
  } catch (error) {
    console.error(
      `Failed to fetch ${tokenId} price from CoinGecko:`,
      error
    )
    return 0
  }
}

const fetchTotalValueStaked = async (
  stakingContract: any
) => {
  try {
    const totalDeposits = await stakingContract.totalDeposits()
    return totalDeposits
  } catch (error) {
    console.error("Failed to fetch total value staked:", error)
    return ethers.BigNumber.from(0)
  }
}

interface MerklePointsProps {
  userAddress: string,
  cellarConfig: ConfigProps
}

export const MerklePoints = ({
  userAddress, cellarConfig
}: MerklePointsProps) => {
  const [merklePoints, setMerklePoints] = useState<string | null>(
    null
  )
  const [merkleData, setMerkleData] = useState<any>(null)
  const [apy, setApy] = useState<number | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const { addToast, close } = useBrandedToast()
  const { stakerSigner } = useCreateContracts(cellarConfig);

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

  useEffect(() => {
    const calculateAPY = async () => {
      try {
        setLoading(true)
        const provider = new ethers.providers.Web3Provider(
          window.ethereum as ExternalProvider
        )

        const [arbPrice, ethPrice, totalValueStaked] =
          await Promise.all([
            fetchPrice(ARB_ID),
            fetchPrice(ETH_ID),
            fetchTotalValueStaked(
              stakerSigner
            ),
          ])

        const totalValueStakedInUsd =
          parseFloat(ethers.utils.formatEther(totalValueStaked)) *
          ethPrice

        const apy =
          ((ARB_TOKENS_IN_PERIOD * arbPrice) /
            totalValueStakedInUsd) *
          (365 / PERIOD_DAYS) *
          100

        setApy(apy)
      } catch (error) {
        console.error("Failed to calculate APY:", error)
        addToast({
          heading: "Error",
          status: "error",
          body: (
            <Text>
              Failed to calculate APY: {(error as Error).message}
            </Text>
          ),
          closeHandler: close,
          duration: null,
        })
      } finally {
        setLoading(false)
      }
    }

    calculateAPY()
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
          addToast({
            heading: "Claim Info",
            status: "info",
            body: <Text>Claim has already been made</Text>,
            closeHandler: close,
            duration: null,
          })
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
        {merklePoints ?? "Loading..."}
      </CardStat>
      <BaseButton onClick={handleClaimMerklePoints}>
        Claim Merkle Rewards
      </BaseButton>
      <Box>
        {loading ? (
          <Spinner size="lg" />
        ) : (
          <Text fontSize="xl" fontWeight="bold">
            Merkle Points APY: {apy ? `${apy.toFixed(2)}%` : "N/A"}
          </Text>
        )}
      </Box>
    </>
  )
}
