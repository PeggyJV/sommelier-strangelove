import { ContractTransaction, ethers } from "ethers"
import { CellarRouter } from "src/abi/types"
import {
  AlphaRouter,
  AlphaRouterParams,
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
import { estimateGasLimit } from "utils/estimateGasLimit"

interface GetSwapRouteParams {
  provider: Provider
  slippage: number
  depositAmount: number
  senderAddress?: string
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
}

interface DepositAndSwapParams_AAVE_V2_STABLE_CELLAR
  extends DepositAndSwapParams {
  cellarRouterSigner: CellarRouter
}

const getSwapRoute = async ({
  selectedToken,
  depositAmount,
  activeAsset,
  provider,
  senderAddress,
  slippage,
}: GetSwapRouteParams) => {
  const router = new AlphaRouter({
    chainId: 1,
    provider: provider as unknown as AlphaRouterParams["provider"],
  })
  let error = false
  let swapRoute
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
    swapRoute = await router.route(
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
  } catch (e) {
    console.warn("Error Occured ", e)
    error = true
  }

  const tokenPath = swapRoute?.route[0].tokenPath.map(
    (token) => token?.address
  )

  const v3Route = swapRoute?.route[0]?.route as V3Route
  const fee = v3Route?.pools[0]?.fee
  const poolFees = swapRoute?.route[0]?.protocol === "V3" ? [fee] : []

  return { route: swapRoute, tokenPath, poolFees, error }
}

export const depositAndSwap = async ({
  payload,
  cellarRouterSigner,
  provider,
  senderAddress,
}: DepositAndSwapParams_AAVE_V2_STABLE_CELLAR): Promise<ContractTransaction> => {
  try {
    const swapRoute = await getSwapRoute({
      depositAmount: payload.depositAmount,
      provider: provider,
      selectedToken: payload.selectedToken,
      senderAddress: senderAddress,
      activeAsset: payload.activeAsset,
      slippage: payload.slippage,
    })
    if (!swapRoute?.route || !swapRoute.tokenPath || swapRoute?.error)
      throw new Error("swapRoute.route is undefined")

    const amtInWei = ethers.utils.parseUnits(
      payload.depositAmount.toString(),
      payload.selectedToken?.decimals
    )
    const minAmountOut = swapRoute.route.quote
      .multiply(
        // must multiply slippage by 100 because value must be an integer (eg. 0.5 -> 50)
        100_00 - payload.slippage * 100
      )
      .divide(100_00)
    const minAmountOutInWei = ethers.utils.parseUnits(
      minAmountOut.toExact(),
      payload.activeAsset?.decimals
    )

    const gasLimit = await estimateGasLimit(
      cellarRouterSigner.estimateGas.depositAndSwapIntoCellar(
        payload.cellarAddress,
        swapRoute.tokenPath,
        swapRoute.poolFees,
        amtInWei,
        minAmountOutInWei,
        senderAddress
      ),
      330000
    )

    return await cellarRouterSigner.depositAndSwapIntoCellar(
      payload.cellarAddress,
      swapRoute.tokenPath,
      swapRoute.poolFees,
      amtInWei,
      minAmountOutInWei,
      senderAddress,
      {
        gasLimit,
      }
    )
  } catch (error) {
    throw error
  }
}
