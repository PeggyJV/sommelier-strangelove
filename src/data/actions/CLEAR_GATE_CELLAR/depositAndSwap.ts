import { ContractTransaction, ethers } from "ethers"
import { ClearGateRouter } from "src/abi/types"
import {
  AlphaRouter,
  AlphaRouterParams,
  SwapRoute,
  V3Route,
} from "@uniswap/smart-order-router"
import {
  Token,
  CurrencyAmount,
  Currency,
  TradeType,
  Percent,
} from "@uniswap/sdk-core"
import JSBI from "jsbi"
import { Provider } from "@wagmi/core"
import { DepositAndSwapParams } from "../types"

interface GetSwapRouteParams {
  swapRoute: SwapRoute
  slippage: number
  activeAsset?: {
    address: string
    decimals: number
    symbol: string
  }
  amountInWei: ethers.BigNumber
}

interface DepositAndSwapParams_CLEAR_GATE_CELLAR
  extends DepositAndSwapParams {
  cellarRouterSigner: ClearGateRouter
}

const createSwapRoute = async ({
  provider,
  selectedToken,
  depositAmount,
  activeAsset,
  senderAddress,
  slippage,
}: {
  senderAddress?: string
  depositAmount: number
  provider: Provider
  selectedToken?: {
    address: string
    decimals: number
    symbol: string
  }
  activeAsset?: {
    address: string
    decimals: number
    symbol: string
  }
  slippage: number
}) => {
  const router = new AlphaRouter({
    chainId: 1,
    provider: provider as unknown as AlphaRouterParams["provider"],
  })
  try {
    const inputToken =
      selectedToken?.address &&
      new Token(
        1, // chainId
        selectedToken?.address,
        selectedToken?.decimals || 18,
        selectedToken?.symbol,
        selectedToken?.symbol
      )
    const amtInWei = ethers.utils.parseUnits(
      depositAmount.toString(),
      selectedToken?.decimals
    )

    const inputAmt = CurrencyAmount.fromRawAmount(
      inputToken as Currency,
      JSBI.BigInt(amtInWei)
    )
    const outputToken = new Token(
      1, // chainId
      activeAsset?.address!,
      activeAsset?.decimals!,
      activeAsset?.symbol,
      activeAsset?.symbol
    )
    const swapRoute = await router.route(
      inputAmt,
      outputToken,
      TradeType.EXACT_INPUT,
      {
        recipient: senderAddress as string,
        slippageTolerance: new Percent(
          // this is done because value must be an integer (eg. 0.5 -> 50)
          slippage * 100,
          100_00
        ),
        deadline: Math.floor(Date.now() / 1000 + 1800),
      }
    )
    return swapRoute
  } catch (error) {
    console.warn(error)
    throw error
  }
}

const createSwapData = ({
  slippage,
  swapRoute,
  activeAsset,
  amountInWei,
}: GetSwapRouteParams) => {
  const minAmountOut = swapRoute.quote
    .multiply(
      // must multiply slippage by 100 because value must be an integer (eg. 0.5 -> 50)
      100_00 - slippage * 100
    )
    .divide(100_00)
  const minAmountOutInWei = ethers.utils.parseUnits(
    minAmountOut.toExact(),
    activeAsset?.decimals
  )

  const tokenPath = swapRoute?.route[0].tokenPath.map(
    (token) => token?.address
  )

  const v3Route = swapRoute?.route[0]?.route as V3Route
  const fee = v3Route?.pools[0]?.fee
  const poolFees = swapRoute?.route[0]?.protocol === "V3" ? [fee] : []

  const swapData = ethers.utils.defaultAbiCoder.encode(
    ["address[]", "uint24[]", "uint256", "uint256"],
    [tokenPath, poolFees, amountInWei, minAmountOutInWei]
  )
  return swapData
}

export const depositAndSwap = async ({
  payload,
  cellarRouterSigner,
  provider,
  senderAddress,
}: DepositAndSwapParams_CLEAR_GATE_CELLAR): Promise<ContractTransaction> => {
  try {
    if (!payload.selectedToken?.address) {
      throw new Error("Token address is undefined")
    }

    const amountInWei = ethers.utils.parseUnits(
      payload.depositAmount.toString(),
      payload.selectedToken?.decimals
    )
    const swapRoute = await createSwapRoute({
      depositAmount: payload.depositAmount,
      provider: provider,
      selectedToken: payload.selectedToken,
      senderAddress: senderAddress,
      activeAsset: payload.activeAsset,
      slippage: payload.slippage,
    })

    if (!swapRoute) {
      throw new Error("swapRoute is undefined")
    }
    const swapData = createSwapData({
      swapRoute,
      slippage: payload.slippage,
      activeAsset: payload.activeAsset,
      amountInWei,
    })

    const gasLimitEstimated = await (async () => {
      try {
        const gas =
          await cellarRouterSigner.estimateGas.depositAndSwap(
            payload.cellarAddress,
            1,
            swapData,
            amountInWei,
            payload.selectedToken?.address!
          )
        return gas.mul(120).div(100).toString() // increase 20%
      } catch (error) {
        return 600000
      }
    })()

    return await cellarRouterSigner.depositAndSwap(
      payload.cellarAddress,
      1,
      swapData,
      amountInWei,
      payload.selectedToken?.address,
      {
        gasLimit: gasLimitEstimated,
      }
    )
  } catch (error) {
    throw error
  }
}
