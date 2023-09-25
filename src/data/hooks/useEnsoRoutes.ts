import { NextApiRequest, NextApiResponse } from "next"
import { CellaAddressDataMap } from "data/cellarDataMap"

// Enso Docs can be found at https://www.enso.finance/developers or https://docs.enso.finance/

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
const ensoApiKey = process.env.NEXT_PUBLIC_ENSO_API_KEY

export interface TokenMap {
  address: string
  amountBaseDenom: Number
}

export interface EnsoRouteConfig {
  fromAddress: string
  tokensIn: TokenMap[]
  tokenOut: string
  slippage: number
}

// ! Before this User must approve WETH spend on the routing contract so it can execute the swap (if not done so already), 
// ! See pt 1 on https://docs.enso.finance/examples/eoa/route-1-position
export const ensoRoutes = async (req: EnsoRouteConfig) => {
  try {
    // Note we expect slippage as a percent, so 3 = 3% slippage, we multiply by 100 for enso
    req.slippage = req.slippage * 100

    // TODO: First check if the tokens to deposit are approved, if not approve them first as part of the actions list

    // Create a list of actions for each input token
    const actions = req.tokensIn.map((tokenIn) => {
      return {
        tokenIn: tokenIn.address,
        tokenOut: req.tokenOut,
        amountIn: tokenIn.amountBaseDenom,
        slippage: req.slippage,
      }
    })

    // TODO, do we need to checksum addresses?

    // TODO: Generalize for multichain
    const data = await fetch(
      `https://api.enso.finance/api/v1/shortcuts/bundle?chainId=1&fromAddress=${req.fromAddress}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ensoApiKey}`,
        },
        body: JSON.stringify({ actions: actions }),
      }
    )

    if (data.status !== 200) {
      throw new Error("failed to fetch data")
    }

    const result = await data.json()

    console.log("------------------")
    console.log(result)


    // TODO: In theory this should be executable here, return component here or just body for execution?



    

  } catch (error) {
    console.error(error)
    
    return {
      error: (error as Error).message || "An unknown error occurred",
    }
  }
}
