import React, { useEffect, useState } from "react"
import { Box, Text, Spinner } from "@chakra-ui/react"
import { ethers, providers } from "ethers"
import { useBrandedToast } from "hooks/chakra"
import { config } from "utils/config"
import { useCoinGeckoPrice } from "data/hooks/useCoinGeckoPrice"
import { tokenConfig, Token } from "src/data/tokenConfig"

const ARB_TOKENS_IN_PERIOD = 30000 // 30,000 ARB tokens
const PERIOD_DAYS = 7 // 7 days

const arbWethToken: Token | undefined = tokenConfig.find(
  (token) => token.symbol === "WETH" && token.chain === "arbitrum"
)

if (!arbWethToken) {
  throw new Error("ARB WETH token configuration not found")
}

const arbToken: Token = {
  chain: "arbitrum",
  coinGeckoId: "arbitrum",
  symbol: "ARB",
  address: "0x...ARB_ADDRESS", // Replace with actual ARB address
  decimals: 18,
  src: "", // Add appropriate src
  alt: "ARB Token",
}

const fetchTotalValueStaked = async (
  provider: providers.Web3Provider,
  stakingContract: any
) => {
  try {
    const contract = new ethers.Contract(
      stakingContract.ADDRESS,
      stakingContract.ABI,
      provider
    )
    const totalDeposits = await contract.totalDeposits()
    return totalDeposits
  } catch (error) {
    console.error("Failed to fetch total value staked:", error)
    return ethers.BigNumber.from(0)
  }
}

const MerkleAPY: React.FC = () => {
  const [apy, setApy] = useState<number | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const { addToast, close } = useBrandedToast()

  const { data: arbPrice, error: arbPriceError } =
    useCoinGeckoPrice(arbToken)
  const { data: ethPrice, error: ethPriceError } = useCoinGeckoPrice(
    arbWethToken!
  )

  useEffect(() => {
    const calculateAPY = async () => {
      try {
        setLoading(true)

        if (!window.ethereum) {
          throw new Error("Ethereum provider is not available")
        }

        const provider = new ethers.providers.Web3Provider(
          window.ethereum as providers.ExternalProvider
        )

        const totalValueStaked = await fetchTotalValueStaked(
          provider,
          config.CONTRACT.REAL_YIELD_ETH_ARB_STAKER
        )

        if (arbPrice && ethPrice) {
          const totalValueStakedInUsd =
            parseFloat(ethers.utils.formatEther(totalValueStaked)) *
            parseFloat(ethPrice)
          const apy =
            ((ARB_TOKENS_IN_PERIOD * parseFloat(arbPrice)) /
              totalValueStakedInUsd) *
            (365 / PERIOD_DAYS) *
            100
          setApy(apy)
        }
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

    if (arbPrice && ethPrice) {
      calculateAPY()
    } else if (arbPriceError || ethPriceError) {
      setLoading(false)
      addToast({
        heading: "Error",
        status: "error",
        body: (
          <Text>
            Failed to fetch prices:{" "}
            {(arbPriceError as Error)?.message ||
              (ethPriceError as Error)?.message}
          </Text>
        ),
        closeHandler: close,
        duration: null,
      })
    }
  }, [
    arbPrice,
    ethPrice,
    arbPriceError,
    ethPriceError,
    addToast,
    close,
  ])

  return (
    <Box>
      {loading ? (
        <Spinner size="lg" />
      ) : (
        <Text fontSize="xl" fontWeight="bold">
          Merkle Points APY: {apy ? `${apy.toFixed(2)}%` : "N/A"}
        </Text>
      )}
    </Box>
  )
}

export default MerkleAPY
