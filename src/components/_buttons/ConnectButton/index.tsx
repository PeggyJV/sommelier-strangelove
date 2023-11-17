import * as React from "react"
import { ButtonProps, HStack } from "@chakra-ui/react"
import { useAccount, useNetwork } from "wagmi"
import ClientOnly from "components/ClientOnly"
import { ConnectedPopover } from "./ConnectedPopover"
import { ConnectWalletPopover } from "./ConnectWalletPopover"
import useBetterMediaQuery from "hooks/utils/useBetterMediaQuery"
import { MobileConnectedPopover } from "./MobileConnectedPopover"
import ChainButton from "../ChainButton"
import { chainConfigMap } from "src/data/chainConfig"

export interface ConnectButtonProps extends Omit<ButtonProps, "children"> {
  unstyled?: boolean
  children?: React.ReactNode
  overrideChainId?: string
}

const ConnectButton = (
  props: ConnectButtonProps
) => {
  const { isConnected } = useAccount()
  const isLarger992 = useBetterMediaQuery("(min-width: 992px)")

  // For connect buttons that are not on header/should allow chain selection
  if (props.overrideChainId) {
    const chain = chainConfigMap[props.overrideChainId]
    return (
      <ClientOnly>
        <HStack>
          {isConnected ? (
            isLarger992 ? (
              <ConnectedPopover />
            ) : (
              <MobileConnectedPopover />
            )
          ) : (
            <ConnectWalletPopover
              wagmiChainId={chain.wagmiId}
              {...props}
            />
          )}
        </HStack>
      </ClientOnly>
    )
  }

  const { chain } = useNetwork()
  const [selectedNetwork, setSelectedNetwork] = React.useState(
    chain?.name.toLowerCase().split(" ")[0] || "ethereum"
  )

  const handleNetworkChange = (chainId: string) => {
    setSelectedNetwork(chainId)
  }

  return (
    <ClientOnly>
      <HStack spacing={"1.5em"}>
        <ChainButton
          chain={chainConfigMap[selectedNetwork]}
          onChainChange={handleNetworkChange}
        />

        {isConnected ? (
          isLarger992 ? (
            <ConnectedPopover />
          ) : (
            <MobileConnectedPopover />
          )
        ) : (
          <ConnectWalletPopover
            wagmiChainId={chainConfigMap[selectedNetwork].wagmiId}
            {...props}
          />
        )}
      </HStack>
    </ClientOnly>
  )
}

export default ConnectButton
