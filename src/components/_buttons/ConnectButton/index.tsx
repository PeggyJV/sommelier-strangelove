///Users/henriots/Desktop/sommelier-strangelove-1/src/components/_buttons/ConnectButton/index.tsx
import * as React from "react";
import { ButtonProps, HStack } from "@chakra-ui/react";
import { useAccount, useNetwork } from "wagmi";
import ClientOnly from "components/ClientOnly";
import { ConnectedPopover } from "./ConnectedPopover";
import { ConnectWalletPopover } from "./ConnectWalletPopover";
import useBetterMediaQuery from "hooks/utils/useBetterMediaQuery";
import { MobileConnectedPopover } from "./MobileConnectedPopover";
import ChainButton from "../ChainButton";
import { chainConfigMap } from "src/data/chainConfig";

export interface ConnectButtonProps extends Omit<ButtonProps, "children"> {
  unstyled?: boolean;
  children?: React.ReactNode;
  overrideChainId?: string;
}

const ConnectButton = (props: ConnectButtonProps) => {
  const { isConnected } = useAccount();
  const isLarger992 = useBetterMediaQuery("(min-width: 992px)");
  const { chain } = useNetwork();
  const [selectedNetwork, setSelectedNetwork] = React.useState(chain?.name.toLowerCase().split(" ")[0] || "ethereum");

  const handleNetworkChange = (chainId: string) => {
    setSelectedNetwork(chainId);
  };

  // If specific logic for Trust Wallet or another wallet needs to be introduced
  const handleSpecialWalletConnection = () => {
    // Placeholder for any specific logic you might want to add for Trust Wallet or other wallets
    // For example, detecting if Trust Wallet is being used and then doing something specific
  };

  React.useEffect(() => {
    // Example: Call the special wallet handler when the component mounts or updates
    handleSpecialWalletConnection();
  }, [chain, isConnected]);

  if (props.overrideChainId) {
    const chain = chainConfigMap[props.overrideChainId];
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
            <ConnectWalletPopover wagmiChainId={chain.wagmiId} {...props} />
          )}
        </HStack>
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <HStack spacing={"1.5em"}>
        <ChainButton chain={chainConfigMap[selectedNetwork]} onChainChange={handleNetworkChange} />
        {isConnected ? (
          isLarger992 ? (
            <ConnectedPopover />
          ) : (
            <MobileConnectedPopover />
          )
        ) : (
          <ConnectWalletPopover wagmiChainId={chainConfigMap[selectedNetwork].wagmiId} {...props} />
        )}
      </HStack>
    </ClientOnly>
  );
};

export default ConnectButton;
