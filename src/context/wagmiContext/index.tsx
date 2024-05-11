import { ReactNode } from "react";
import { createClient, http } from 'viem';  // Import http transport from Viem
import { injected, walletConnect, coinbaseWallet, metaMask } from 'wagmi/connectors';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { arbitrum, mainnet, optimism } from "wagmi/chains";
import { WagmiConfig } from "wagmi";

const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_KEY;
const WALLETCONNECT_PROJECT_ID = process.env.NEXT_WALLETCONNECT_PROJECT_ID;

const queryClient = new QueryClient();

// HTTP transports for each chain
const alchemyTransport = http(`https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_API_KEY}`);

// Creating the client directly with chain and transport configurations
const client = createClient({
  autoConnect: true,
  chains: [mainnet, arbitrum, optimism],
  transports: {
    [mainnet.id]: alchemyTransport,
    [arbitrum.id]: alchemyTransport, 
    [optimism.id]: alchemyTransport 
  },
  connectors: () => [
    walletConnect({
      chains: [mainnet, arbitrum, optimism],
      options: {
        projectId: WALLETCONNECT_PROJECT_ID || "c11d8ffaefb8ba4361ae510ed7690cb8",
        qrcode: true,
      },
    }),
    metaMask({ chains: [mainnet, arbitrum, optimism] }),
    injected({
      chains: [mainnet, arbitrum, optimism],
      options: { shimDisconnect: true },
    }),
    coinbaseWallet({
      chains: [mainnet, arbitrum, optimism],
      options: {
        appName: "Sommelier",
        darkMode: true,
      },
    }),
  ]
});

export const WagmiProvider = ({ children }: { children: ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig client={client}>
        {children}
      </WagmiConfig>
    </QueryClientProvider>
  );
};
