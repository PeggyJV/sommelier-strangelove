import * as React from "react"
import { ButtonProps, HStack } from "@chakra-ui/react"
import { useAccount } from "wagmi"
import ClientOnly from "components/ClientOnly"
import { ConnectedPopover } from "./ConnectedPopover"
import { ConnectWalletPopover } from "./ConnectWalletPopover"
import useBetterMediaQuery from "hooks/utils/useBetterMediaQuery"
import { MobileConnectedPopover } from "./MobileConnectedPopover"
import ChainButton from "../ChainButton"
import { chainConfig, chainConfigMap } from "src/data/chainConfig"

export interface ConnectButtonProps extends Omit<ButtonProps, "children"> {
  unstyled?: boolean
  children?: React.ReactNode
  overridechainid?: string
}

const ConnectButton = (
  props: ConnectButtonProps
) => {
  const { isConnected, chain } = useAccount()
  const isLarger992 = useBetterMediaQuery("(min-width: 992px)")

  const getChainName = () => {
    return chainConfig.find(c => c.viemChain.name === chain?.name)?.id || "ethereum"
  }

  const [selectedNetwork, setSelectedNetwork] = React.useState(
    getChainName()
  )
  const handleNetworkChange = (chainId: string) => {
    setSelectedNetwork(chainId)
  }

  // For connect buttons that are not on header/should allow chain selection
  if (props.overridechainid) {
    const chain = chainConfigMap[props.overridechainid]
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
