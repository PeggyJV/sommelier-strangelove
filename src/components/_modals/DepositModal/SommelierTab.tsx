import {
  HStack,
  ModalProps,
  Text,
  VStack,
  FormControl,
  FormErrorMessage,
  Icon,
  Spinner,
  Avatar,
  Flex,
  IconButton,
} from "@chakra-ui/react"
import { useEffect, useState, VFC } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { BaseButton } from "components/_buttons/BaseButton"
import { AiOutlineInfo } from "react-icons/ai"
import { FiSettings } from "react-icons/fi"
import { ModalMenu } from "components/_menus/ModalMenu"
import {
  depositAssetTokenConfig,
  Token as TokenType,
  tokenConfig,
} from "data/tokenConfig"
import { Link } from "components/Link"
import { config } from "utils/config"
import {
  erc20ABI,
  useSigner,
  useAccount,
  useBalance,
  useToken,
} from "wagmi"
import { ethers } from "ethers"
import { useBrandedToast } from "hooks/chakra"

interface FormValues {
  depositAmount: number
  slippage: number
  selectedToken: TokenType
}
import { CardHeading } from "components/_typography/CardHeading"
import { getCurrentAsset } from "utils/getCurrentAsset"
import { ExternalLinkIcon } from "components/_icons"
import { analytics } from "utils/analytics"
import { useRouter } from "next/router"
import { SwapSettingsCard } from "components/_cards/SwapSettingsCard"
import { cellarDataMap } from "data/cellarDataMap"
import { useWaitForTransaction } from "hooks/wagmi-helper/useWaitForTransactions"
import { useCreateContracts } from "data/hooks/useCreateContracts"
import { useActiveAsset } from "data/hooks/useActiveAsset"
import { useDepositAndSwap } from "data/hooks/useDepositAndSwap"
import { isActiveTokenStrategyEnabled } from "data/uiConfig"

type DepositModalProps = Pick<ModalProps, "isOpen" | "onClose">

export const SommelierTab: VFC<DepositModalProps> = (props) => {
  const id = useRouter().query.id as string
  const cellarConfig = cellarDataMap[id].config
  const cellarName = cellarDataMap[id].name
  const depositTokens = cellarDataMap[id].depositTokens.list

  const { data: signer } = useSigner()
  const { address } = useAccount()
  const { addToast, update, close, closeAll } = useBrandedToast()

  const [selectedToken, setSelectedToken] =
    useState<TokenType | null>(null)
  const [showSwapSettings, setShowSwapSettings] = useState(false)
  const methods = useForm<FormValues>({
    defaultValues: { slippage: config.SWAP.SLIPPAGE },
  })
  const {
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods
  const watchDepositAmount = watch("depositAmount")
  const isError =
    errors.depositAmount !== undefined ||
    errors.slippage !== undefined
  const isDisabled =
    isNaN(watchDepositAmount) || watchDepositAmount <= 0 || isError

  function trackedSetSelectedToken(value: TokenType | null) {
    if (value && value !== selectedToken) {
      analytics.track("deposit.stable-selected", {
        stable: value.symbol,
      })
    }

    setSelectedToken(value)
  }

  const { cellarSigner } = useCreateContracts(cellarConfig)

  const {
    data: activeAsset,
    refetch: activeAssetRefetch,
    isLoading: activeAssetLoading,
  } = useActiveAsset(cellarConfig)
  const activeAssetToken = useToken({
    address: activeAsset?.address,
    chainId: 1,
  })

  const [_, wait] = useWaitForTransaction({
    skip: true,
  })

  const { data: selectedTokenBalance } = useBalance({
    addressOrName: address,
    token: selectedToken?.address,
    formatUnits: "wei",
    watch: true,
  })

  const erc20Contract =
    selectedToken?.address &&
    new ethers.Contract(selectedToken?.address, erc20ABI, signer!)

  const depositAndSwap = useDepositAndSwap(cellarConfig)

  const isActiveAsset =
    selectedToken?.address?.toLowerCase() ===
    activeAsset?.address?.toLowerCase()

  const onSubmit = async (data: any, e: any) => {
    const tokenSymbol = data?.selectedToken?.symbol
    const depositAmount = data?.depositAmount

    // if swap slippage is not set, use default value
    const slippage = data?.slippage

    if (!erc20Contract) return
    analytics.track("deposit.started", {
      stable: tokenSymbol,
      value: depositAmount,
    })

    // check if approval exists
    const allowance = await erc20Contract.allowance(
      address,
      isActiveAsset
        ? cellarConfig.cellar.address
        : cellarConfig.cellarRouter.address
    )

    const amtInWei = ethers.utils.parseUnits(
      depositAmount.toString(),
      selectedTokenBalance?.decimals
    )

    let needsApproval
    try {
      needsApproval = allowance.lt(amtInWei)
    } catch (e) {
      console.error("Invalid Input")
      return
    }

    if (needsApproval) {
      analytics.track("deposit.approval-required", {
        stable: tokenSymbol,
        value: depositAmount,
      })

      try {
        const { hash } = await erc20Contract.approve(
          isActiveAsset
            ? cellarConfig.cellar.address
            : cellarConfig.cellarRouter.address,
          ethers.constants.MaxUint256
        )
        addToast({
          heading: "ERC20 Approval",
          status: "default",
          body: <Text>Approving ERC20</Text>,
          isLoading: true,
          closeHandler: close,
          duration: null,
        })
        const waitForApproval = wait({ confirmations: 1, hash })
        const result = await waitForApproval
        if (result?.data?.transactionHash) {
          analytics.track("deposit.approval-granted", {
            stable: tokenSymbol,
            value: depositAmount,
          })

          update({
            heading: "ERC20 Approval",
            body: <Text>ERC20 Approved</Text>,
            status: "success",
            closeHandler: closeAll,
          })
        } else if (result?.error) {
          analytics.track("deposit.approval-failed", {
            stable: tokenSymbol,
            value: depositAmount,
          })

          update({
            heading: "ERC20 Approval",
            body: <Text>Approval Failed</Text>,
            status: "error",
            closeHandler: closeAll,
          })
        }
      } catch (e) {
        analytics.track("deposit.approval-cancelled", {
          stable: tokenSymbol,
          value: depositAmount,
        })

        addToast({
          heading: "ERC20 Approval",
          body: <Text>Approval Cancelled</Text>,
          status: "error",
          closeHandler: closeAll,
        })
      }
    }

    try {
      // If selected token is cellar's current asset, it is cheapter to deposit into the cellar
      // directly rather than through the router. Should only use router when swapping into the
      // cellar's current asset.
      const response = isActiveAsset
        ? await cellarSigner.deposit(amtInWei, address)
        : await depositAndSwap.mutateAsync({
            cellarAddress: cellarConfig.cellar.address,
            depositAmount: depositAmount,
            slippage,
            activeAsset: {
              address: activeAsset?.address!,
              decimals: activeAssetToken.data?.decimals!,
              symbol: activeAsset?.symbol!,
            },
            selectedToken: {
              address: selectedToken.address,
              decimals: selectedTokenBalance?.decimals!,
              symbol: selectedToken.symbol,
            },
          })

      if (!response) throw new Error("response is undefined")

      addToast({
        heading: cellarName + " Cellar Deposit",
        status: "default",
        body: <Text>Depositing {selectedToken?.symbol}</Text>,
        isLoading: true,
        closeHandler: close,
        duration: null,
      })
      const waitForDeposit = wait({
        confirmations: 1,
        hash: response.hash,
      })

      const depositResult = await waitForDeposit
      if (depositResult?.data?.transactionHash) {
        analytics.track("deposit.succeeded", {
          stable: tokenSymbol,
          value: depositAmount,
        })

        activeAssetRefetch()
        props.onClose()

        update({
          heading: cellarName + " Cellar Deposit",
          body: (
            <>
              <Text>Deposit Success</Text>
              <Link
                display="flex"
                alignItems="center"
                href={`https://etherscan.io/tx/${depositResult?.data?.transactionHash}`}
                isExternal
              >
                <Text as="span">View on Etherscan</Text>
                <ExternalLinkIcon ml={2} />
              </Link>
            </>
          ),
          status: "success",
          closeHandler: closeAll,
          duration: null, // toast won't close until user presses close button
        })
      }

      activeAssetRefetch()

      if (depositResult?.error) {
        analytics.track("deposit.failed", {
          stable: tokenSymbol,
          value: depositAmount,
        })

        update({
          heading: cellarName + " Cellar Deposit",
          body: <Text>Deposit Failed</Text>,
          status: "error",
          closeHandler: closeAll,
        })
      }
    } catch (e) {
      addToast({
        heading: cellarName + " Cellar Deposit",
        body: <Text>Deposit Cancelled</Text>,
        status: "error",
        closeHandler: closeAll,
      })
      console.warn("failed to deposit", e)
    }
  }

  const onError = async (errors: any, e: any) => {
    // try and handle basic cases
    // gasFailure
    // onChain assert
    addToast({
      heading: cellarName + " Cellar Deposit",
      body: <Text>Deposit Failed</Text>,
      status: "error",
      closeHandler: closeAll,
    })
  }

  const loading = activeAssetLoading

  const currentAsset = getCurrentAsset(
    tokenConfig,
    activeAsset?.address
  )

  // Move active asset to top of token list.
  useEffect(() => {
    if (currentAsset === undefined) return

    const indexOfActiveAsset = depositAssetTokenConfig.findIndex(
      (token) => token === currentAsset
    )

    depositAssetTokenConfig.splice(
      0,
      0,
      depositAssetTokenConfig.splice(indexOfActiveAsset, 1)[0]
    )
  }, [activeAsset?.address, currentAsset])

  // Close swap settings card if user changed current asset to active asset.
  useEffect(() => {
    if (selectedToken?.address === currentAsset?.address)
      setShowSwapSettings(false)
  }, [currentAsset?.address, selectedToken?.address])

  return (
    <>
      <VStack pb={10} spacing={6} align="stretch">
        <VStack align="stretch">
          <CardHeading>cellar details</CardHeading>
          <HStack justify="space-between">
            <Text as="span">Cellar</Text>
            <Text as="span">{cellarName}</Text>
          </HStack>
          {isActiveTokenStrategyEnabled(cellarConfig) && (
            <HStack justify="space-between">
              <Text as="span">Active token strategy</Text>
              {loading ? (
                <Spinner size="xs" />
              ) : (
                <HStack spacing={1}>
                  <Avatar
                    boxSize={6}
                    src={currentAsset?.src}
                    name={currentAsset?.alt}
                    borderWidth={2}
                    borderColor="surface.bg"
                    bg="surface.bg"
                  />
                  <Text as="span">{currentAsset?.symbol}</Text>
                </HStack>
              )}
            </HStack>
          )}
        </VStack>
      </VStack>
      <FormProvider {...methods}>
        <VStack
          as="form"
          spacing={8}
          align="stretch"
          onSubmit={handleSubmit(onSubmit, onError)}
        >
          <FormControl isInvalid={isError as boolean | undefined}>
            <Flex
              alignItems="center"
              justifyContent="space-between"
              position="relative" // anchors the swap settings card, which is positioned as absolute
            >
              <CardHeading pb={2}>enter amount</CardHeading>
              <IconButton
                aria-label="swap settings"
                colorScheme="transparent"
                disabled={isActiveAsset}
                icon={<FiSettings />}
                onClick={() => {
                  setShowSwapSettings(!showSwapSettings)
                }}
              />

              {showSwapSettings && <SwapSettingsCard />}
            </Flex>

            <ModalMenu
              depositTokens={depositTokens}
              setSelectedToken={trackedSetSelectedToken}
              activeAsset={activeAsset?.address}
              selectedTokenBalance={selectedTokenBalance}
            />
            <FormErrorMessage color="energyYellow">
              <Icon
                p={0.5}
                mr={1}
                color="surface.bg"
                bg="red.base"
                borderRadius="50%"
                as={AiOutlineInfo}
              />
              {errors.depositAmount?.message ??
                errors.slippage?.message}
            </FormErrorMessage>
          </FormControl>
          <BaseButton
            type="submit"
            isDisabled={isDisabled}
            isLoading={isSubmitting}
            fontSize={21}
            py={8}
            px={12}
          >
            Submit
          </BaseButton>
        </VStack>
      </FormProvider>
    </>
  )
}
