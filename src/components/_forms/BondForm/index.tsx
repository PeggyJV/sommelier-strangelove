import { VFC } from "react"
import {
  Button,
  FormControl,
  FormErrorMessage,
  Heading,
  HStack,
  Icon,
  Image,
  Input,
  ModalProps,
  Text,
  VStack,
  Tooltip,
  Th,
} from "@chakra-ui/react"
import { FormProvider, useForm } from "react-hook-form"
import { BaseButton } from "components/_buttons/BaseButton"
import { AiOutlineInfo } from "react-icons/ai"
import { CardHeading } from "components/_typography/CardHeading"
import { BondingPeriodOptions } from "./BondingPeriodOptions"
import { toEther } from "utils/formatCurrency"
import { useBrandedToast } from "hooks/chakra"
import { BigNumber } from "bignumber.js"
import { useApproveERC20, useHandleTransaction } from "hooks/web3"
import { ethers } from "ethers"
import { analytics } from "utils/analytics"
import { cellarDataMap } from "data/cellarDataMap"
import { useRouter } from "next/router"
import { useCreateContracts } from "data/hooks/useCreateContracts"
import { useUserBalances } from "data/hooks/useUserBalances"
import { bondingPeriodOptions } from "data/uiConfig"
import { estimateGasLimitWithRetry } from "utils/estimateGasLimit"
import { useGeo } from "context/geoContext"
import { useUserStrategyData } from "data/hooks/useUserStrategyData"
import { CellarNameKey } from "data/types"
import { InformationIcon } from "components/_icons"

interface FormValues {
  depositAmount: number
  bondingPeriod: number
}

type BondFormProps = Pick<ModalProps, "onClose">

export const BondForm: VFC<BondFormProps> = ({ onClose }) => {
  const id = useRouter().query.id as string
  const cellarConfig = cellarDataMap[id].config

  const { refetch } = useUserStrategyData(cellarConfig.cellar.address)
  const { stakerSigner } = useCreateContracts(cellarConfig)

  const { lpToken, lpTokenInfo } = useUserBalances(cellarConfig)
  const { data: lpTokenData } = lpToken

  const methods = useForm<FormValues>({
    defaultValues: { bondingPeriod: 0 },
  })
  const {
    register,
    watch,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = methods
  const { addToast, closeAll } = useBrandedToast()

  const { doApprove } = useApproveERC20({
    tokenAddress: cellarConfig.cellar.address,
    spender: cellarConfig.staker?.address!,
  })

  const { doHandleTransaction } = useHandleTransaction()

  const watchDepositAmount = watch("depositAmount")
  const bondPeriod = watch("bondingPeriod")

  const isDisabled =
    isNaN(watchDepositAmount) || watchDepositAmount <= 0
  const isError = errors.depositAmount

  const setMax = () =>
    setValue(
      "depositAmount",
      parseFloat(
        toEther(
          lpTokenData?.formatted,
          lpTokenData?.decimals,
          false,
          6
        )
      )
    )

  const geo = useGeo()

  const onSubmit = async (data: FormValues) => {
    if (geo?.isRestrictedAndOpenModal()) {
      return;
    }
    if (!stakerSigner) {
      return addToast({
        heading: "No wallet connected",
        body: <Text>Please connect your wallet</Text>,
        status: "error",
        closeHandler: closeAll,
      });
    }
  
    const analyticsData = {
      depositAmount: data.depositAmount,
      bondingPeriod: data.bondingPeriod,
      duration: bondingPeriodOptions(cellarConfig)[bondPeriod],
      lpTokenSymbol: lpTokenInfo.data?.symbol,
      cellarName,
      cellarAddress,
      pageLink: currentPageLink,
    };
  
    analytics.track("bond.started", analyticsData);
  
    try {
      await doApprove(data.depositAmount, {
        onSuccess: () => analytics.track("bond.approval-succeeded", analyticsData),
        onError: (error) => {
          analytics.track("bond.approval-failed", analyticsData);
          throw error;
        },
      });
  
      const amtInBigNumber = new BigNumber(data.depositAmount);
      const depositAmtInWei = ethers.utils.parseUnits(
        amtInBigNumber.toFixed(),
        cellarConfig.cellar.decimals
      );
  
      const gasLimitEstimated = await estimateGasLimitWithRetry(
        stakerSigner.estimateGas.stake,
        stakerSigner.callStatic.stake,
        [depositAmtInWei, bondPeriod],
        250000,
        500000
      );
  
      const { hash: bondConf } = await stakerSigner.stake(
        depositAmtInWei,
        bondPeriod,
        { gasLimit: gasLimitEstimated }
      );
  
      await doHandleTransaction({
        hash: bondConf,
        onSuccess: () => {
          analytics.track("bond.succeeded", analyticsData);
          refetch();
          onClose();
        },
        onError: () => analytics.track("bond.failed", analyticsData),
      });
      refetch();
    } catch (e) {
      console.warn(e);
      const error = e as Error;
      analytics.track("bond.error", { ...analyticsData, errorMessage: error.message });
      if (error.message === "GAS_LIMIT_ERROR") {
        addToast({
          heading: "Transaction not submitted",
          body: (
            <Text>
              The gas fees are particularly high right now. To avoid a
              failed transaction leading to wasted gas, please try
              again later.
            </Text>
          ),
          status: "info",
          closeHandler: closeAll,
        });
      } else {
        addToast({
          heading: "Staking LP Tokens",
          body: <Text>Tx Cancelled</Text>,
          status: "info",
          closeHandler: closeAll,
        });
      }
    }
  };
  