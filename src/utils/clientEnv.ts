// Client-safe environment variable access
// This module provides safe access to environment variables that works both on server and client

// Ensure process.env exists even on client-side
if (typeof window !== "undefined" && typeof process === "undefined") {
  // @ts-expect-error -- legacy typing gap
  window.process = { env: {} };
}

// Type-safe environment variable interface
interface ClientEnv {
  NEXT_PUBLIC_ALCHEMY_KEY?: string;
  NEXT_PUBLIC_INFURA_API_KEY?: string;
  NEXT_PUBLIC_QUICKNODE_KEY?: string;
  NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID?: string;
  NEXT_PUBLIC_SENTRY_DSN?: string;
  NEXT_PUBLIC_PLAUSIBLE_URL?: string;
  NEXT_PUBLIC_BASE_URL?: string;
  NEXT_PUBLIC_COINGECKO_API_KEY?: string;
  NEXT_PUBLIC_ENSO_API_KEY?: string;
  NEXT_PUBLIC_DEBUG_SORT?: string;
  NEXT_PUBLIC_SHOW_ALL_MANAGE_PAGE?: string;
}

// Safe environment variable getter
function getEnvVar(key: keyof ClientEnv): string | undefined {
  if (typeof process !== "undefined" && process.env) {
    return process.env[key];
  }

  // On client-side, Next.js should have replaced these at build time
  // but if not, return undefined safely
  return undefined;
}

// Export a safe env object that won't throw errors
export const clientEnv: ClientEnv = {
  NEXT_PUBLIC_ALCHEMY_KEY: getEnvVar("NEXT_PUBLIC_ALCHEMY_KEY"),
  NEXT_PUBLIC_INFURA_API_KEY: getEnvVar("NEXT_PUBLIC_INFURA_API_KEY"),
  NEXT_PUBLIC_QUICKNODE_KEY: getEnvVar("NEXT_PUBLIC_QUICKNODE_KEY"),
  NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: getEnvVar("NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID"),
  NEXT_PUBLIC_SENTRY_DSN: getEnvVar("NEXT_PUBLIC_SENTRY_DSN"),
  NEXT_PUBLIC_PLAUSIBLE_URL: getEnvVar("NEXT_PUBLIC_PLAUSIBLE_URL"),
  NEXT_PUBLIC_BASE_URL: getEnvVar("NEXT_PUBLIC_BASE_URL"),
  NEXT_PUBLIC_COINGECKO_API_KEY: getEnvVar("NEXT_PUBLIC_COINGECKO_API_KEY"),
  NEXT_PUBLIC_ENSO_API_KEY: getEnvVar("NEXT_PUBLIC_ENSO_API_KEY"),
  NEXT_PUBLIC_DEBUG_SORT: getEnvVar("NEXT_PUBLIC_DEBUG_SORT"),
  NEXT_PUBLIC_SHOW_ALL_MANAGE_PAGE: getEnvVar("NEXT_PUBLIC_SHOW_ALL_MANAGE_PAGE"),
};

// Helper function for backward compatibility
export function getClientEnv(key: keyof ClientEnv): string | undefined {
  return clientEnv[key];
}

// Re-export for convenience
export default clientEnv;
