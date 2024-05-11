import { ReactNode } from "react";
import { mainnet, configureChains, createClient, WagmiConfig } from "wagmi";
import { arbitrum, optimism } from "wagmi/chains";
import { infuraProvider } from "wagmi/providers/infura";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { injected, walletConnect, coinbaseWallet, metaMask } from 'wagmi/connectors';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_KEY;
const WALLETCONNECT_PROJECT_ID = process.env.NEXT_WALLETCONNECT_PROJECT_ID;
const INFURA_API_KEY = process.env.NEXT_PUBLIC_INFURA_API_KEY;

const queryClient = new QueryClient();

const { chains, provider, webSocketProvider } = configureChains(
  [mainnet, arbitrum, optimism],
  [
    alchemyProvider({ apiKey: ALCHEMY_API_KEY }),
    infuraProvider({ apiKey: INFURA_API_KEY }),
  ],
  { targetQuorum: 1 }
);

const connectors = () => {
  return [
    walletConnect({
      chains,
      options: {
        projectId: WALLETCONNECT_PROJECT_ID || "c11d8ffaefb8ba4361ae510ed7690cb8",
        qrcode: true,
      },
    }),
    metaMask({ chains }),
    injected({
      chains,
      options: { shimDisconnect: true },
    }),
    coinbaseWallet({
      chains,
      options: {
        appName: "Sommelier",
        darkMode: true,
      },
    }),
  ];
};

const client = createClient({
  autoConnect: true,
  provider,
  connectors: connectors(),
  webSocketProvider,
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
