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

export const getEnsoRouterAddress = async (fromAddress: string) => {
  const response = await fetch(
    `https://api.enso.finance/api/v1/wallet?chainId=1&fromAddress=${fromAddress}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ensoApiKey}`,
        "Access-Control-Allow-Origin": "*",
      },
    }
  )
  const routerAddress = (await response.json()).address
  return routerAddress
}

// ! Before this User must approve spend on the routing contract so it can execute the swap (if not done so already),
// ! See pt 1 on https://docs.enso.finance/examples/eoa/route-1-position
export const useEnsoRoutes = (
  config: EnsoRouteConfig,
  shouldFetch: boolean,
  lastResponse: any
) => {
  // Enso routes aren't in use for now and to avoid failing requests, returning early
  return { ensoResponse: '1', ensoError: null, ensoLoading: false };
  const [ensoResponse, setResponse] = useState<any>(null)
  const [ensoError, setError] = useState<string | null>(null)
  const [ensoLoading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    if (!shouldFetch) {
      setLoading(false)
      setError(null)
      setResponse(lastResponse)
      return
    }

    let intervalId: number

    const fetchRoutes = async () => {
      setLoading(true)
      setError(null)
      try {
        const actions = config.tokensIn.map((tokenIn) => {
          return {
            protocol: "enso",
            action: "route",
            args: {
              tokenIn: tokenIn.address,
              tokenOut: config.tokenOut,
              amountIn: String(tokenIn.amountBaseDenom),
              slippage: String(config.slippage * 100),
            },
          }
        })

        // For now only support a single token in, so assert len actions == 1
        if (actions.length !== 1) {
          throw new Error(
            "Current routing implementation only support a single token in."
          )
        }

        // TODO: Generalize for multichain (check if enso actually supports multichain first)
        const formattedRouteURL = `https://api.enso.finance/api/v1/shortcuts/route?chainId=1&fromAddress=${config.fromAddress}&receiver=${config.fromAddress}&spender=${config.fromAddress}&amountIn=${actions[0].args.amountIn}&tokenIn=${actions[0].args.tokenIn}&tokenOut=${actions[0].args.tokenOut}&slippage=${actions[0].args.slippage}&routingStrategy=router`

        const response = await fetch(`${formattedRouteURL}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${ensoApiKey}`,
            "Access-Control-Allow-Origin": "*",
          },
        })

        if (response.status === 404) {
          throw new Error("No routes found")
        }

        if (response.status !== 200) {
          console.log(response.status)
          throw new Error("Internal Router Error")
        }
        const result = await response.json()

        setResponse(result)
        setLoading(false)
        setError(null)
      } catch (error) {
        console.log(error)
        setError(
          (error as Error).message || "An unknown error occurred"
        )
        setLoading(false)
      }
    }
    fetchRoutes()

    // Run fetchRoutes every 10 seconds
    intervalId = setInterval(fetchRoutes, 10000) as unknown as number

    // Cleanup function to clear the interval when the component unmounts
    return () => {
      clearInterval(intervalId)
    }
  }, [config, shouldFetch])

  return { ensoResponse, ensoError, ensoLoading }
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

  const { ensoResponse, ensoError, ensoLoading } = useEnsoRoutes(config);


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
