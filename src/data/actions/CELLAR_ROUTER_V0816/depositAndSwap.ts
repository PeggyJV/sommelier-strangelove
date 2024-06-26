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
import { DepositAndSwapParams } from "../types"
import { estimateGasLimitWithRetry } from "utils/estimateGasLimit"
import { encodeAbiParameters, parseAbiParameters, parseUnits, Transaction } from "viem"

interface GetSwapRouteParams {
  swapRoute: SwapRoute
  slippage: number
  activeAsset?: {
    address: string
    decimals: number
    symbol: string
  }
  amountInWei: bigint
}

interface DepositAndSwapParams_V0816 extends DepositAndSwapParams {
  cellarRouterSigner: any
}

interface CreateSwapRouteParams {
  senderAddress?: string
  depositAmount: number
  provider: any
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
}

const createSwapRoute = async ({
  provider,
  selectedToken,
  depositAmount,
  activeAsset,
  senderAddress,
  slippage,
}: CreateSwapRouteParams) => {
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
    const amtInWei = parseUnits(
      depositAmount.toString(),
      selectedToken?.decimals ?? 0
    )

    const inputAmt = CurrencyAmount.fromRawAmount(
      inputToken as Currency,
      amtInWei.toString()
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
  const minAmountOutInWei = parseUnits(
    minAmountOut.toExact(),
    activeAsset?.decimals ?? 0
  )

  const tokenPath = swapRoute?.route[0].tokenPath.map(
    (token) => token?.address as `0x${string}`
  )

  const v3Route = swapRoute?.route[0]?.route as V3Route
  const fee = v3Route?.pools[0]?.fee
  const poolFees = swapRoute?.route[0]?.protocol === "V3" ? [fee] : []

  const swapData = encodeAbiParameters(
    parseAbiParameters('address[] a, uint24[] b, uint256 c, uint256 d'),
    [tokenPath, poolFees, amountInWei, minAmountOutInWei]
  )
  return swapData
}

export const depositAndSwap = async ({
  payload,
  cellarRouterSigner,
  provider,
  senderAddress,
}: DepositAndSwapParams_V0816): Promise<Transaction> => {
  try {
    if (!payload.selectedToken?.address) {
      throw new Error("Token address is undefined")
    }

    const amountInWei = parseUnits(
      payload.depositAmount.toString(),
      payload.selectedToken?.decimals ?? 0
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

    const gasLimitEstimated = await estimateGasLimitWithRetry(
      cellarRouterSigner.estimateGas.depositAndSwap,
      cellarRouterSigner.simulate.depositAndSwap,
      [
        payload.cellarAddress,
        1,
        swapData,
        amountInWei,
        payload.selectedToken?.address!,
      ],
      600000,
      senderAddress
    )

    return await cellarRouterSigner.write.depositAndSwap([
      payload.cellarAddress,
      1,
      swapData,
      amountInWei,
      payload.selectedToken?.address
      ],
      {
        account: senderAddress,
        gasLimit: gasLimitEstimated,
      }
    )
  } catch (error) {
    throw error
  }
}
