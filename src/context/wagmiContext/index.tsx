import { ReactNode } from 'react';
import { mainnet, arbitrum, optimism } from 'wagmi/chains';
import { injected, walletConnect, coinbaseWallet } from 'wagmi/connectors';
import { createClient, WagmiProvider as WagmiConfig } from 'wagmi';
import { http } from 'viem';

// Verify your environment variables are correct and accessible
const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_KEY;
const INFURA_API_KEY = process.env.NEXT_PUBLIC_INFURA_API_KEY;

const provider = http(`https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_API_KEY}`);
const webSocketProvider = http(`https://mainnet.infura.io/v3/${INFURA_API_KEY}`);

const connectors = () => [
  walletConnect({
    chains: [mainnet, arbitrum, optimism],
    options: {
      projectId: process.env.NEXT_WALLETCONNECT_PROJECT_ID || 'c11d8ffaefb8ba4361ae510ed7690cb8',
      showQrModal: true,
    },
  }),
  injected({
    chains: [mainnet, arbitrum, optimism],
    options: { shimDisconnect: true },
  }),
  coinbaseWallet({
    chains: [mainnet, arbitrum, optimism],
    options: {
      appName: 'Sommelier',
      darkMode: true,
    },
  }),
];

try {
  const client = createClient({
    autoConnect: true,
    provider,
    connectors: connectors(),
    webSocketProvider,
  });

  export const WagmiProvider = ({ children }: { children: ReactNode }) => {
    return <WagmiConfig client={client}>{children}</WagmiConfig>;
  };
} catch (error) {
  console.error('Error creating Wagmi client:', error);
}
