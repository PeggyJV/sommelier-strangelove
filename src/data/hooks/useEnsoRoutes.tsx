import { useState, useEffect } from "react"
// Enso Docs can be found at https://www.enso.finance/developers or https://docs.enso.finance/

const ensoApiKey = process.env.NEXT_PUBLIC_ENSO_API_KEY

export interface TokenMap {
  address: string
  amountBaseDenom: number
}

export interface EnsoRouteConfig {
  fromAddress: string
  tokensIn: TokenMap[]
  tokenOut: string
  slippage: number
}

// TODO: Create helper function for below
// ! Before this User must approve WETH spend on the routing contract so it can execute the swap (if not done so already),
// ! See pt 1 on https://docs.enso.finance/examples/eoa/route-1-position
export const useEnsoRoutes = (config: EnsoRouteConfig) => {
  const [response, setResponse] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        // TODO: First check if the tokens to deposit are approved, if not approve them first as part of the actions list

        const actions = config.tokensIn.map((tokenIn) => {
          return {
            tokenIn: tokenIn.address,
            tokenOut: config.tokenOut,
            amountIn: tokenIn.amountBaseDenom,
            slippage: config.slippage * 100,
          }
        })

        // TODO, do we need to checksum addresses?



        // TODO: Generalize for multichain
        const response = await fetch(
          `https://api.enso.finance/api/v1/shortcuts/bundle?chainId=1&fromAddress=${config.fromAddress}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${ensoApiKey}`,
            },
            body: JSON.stringify({ actions: actions }),
          }
        )

        if (response.status !== 200) {
          throw new Error("failed to fetch data")
        }

        const result = await response.json()

        setResponse(result)
        setLoading(false)
      } catch (error) {
        setError(
          (error as Error).message || "An unknown error occurred"
        )
        setLoading(false)
      }
    }

    fetchRoutes()
  }, [config])

  return { response, error, loading }
}

// Example Usage
/** 
import { useEnsoRoutes } from '....';

const EnsoDepositComponent = () => {
  const config = {
    fromAddress: 'user_address',
    tokensIn: [{
      address: 'token_address',
      amountBaseDenom: 100
    }],
    tokenOut: 'final_token',
    slippage: 1 // 1% slippage
  };
  
  const { response, error, loading } = useEnsoRoutes(config);
  

  // TODO: I think (need to verify) you'd want a helper function here to see if the user has approved the enso contract to spend their tokens before actually submitting the final tx

  // Basically here you need to render the UX object
  return (
    <div>
      {loading && <p>Loading...</p>} // If its loading show a loading indicator
      {error && <p>Error: {error}</p>} // If its an error add a toast or something
      {Render your response here } // If we get a good response, show user how many tokens out expected, and if the user hits submit send the tx
    </div>
  );
}
**/
