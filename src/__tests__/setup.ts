import "@testing-library/jest-dom"

// Polyfill TextEncoder for Node.js test environment
import { TextEncoder, TextDecoder } from "util"
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder as any

// Mock Next.js router
jest.mock("next/router", () => ({
  useRouter() {
    return {
      route: "/",
      pathname: "/",
      query: {},
      asPath: "/",
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
      isFallback: false,
    }
  },
}))

// Mock wagmi hooks
jest.mock("wagmi", () => ({
  useAccount: () => ({
    address: "0x1234567890123456789012345678901234567890",
    isConnected: true,
    chain: { id: 1, name: "Ethereum" },
  }),
  usePublicClient: () => ({
    chain: { id: 1, name: "Ethereum" },
    getBalance: jest.fn(),
    readContract: jest.fn(),
    waitForTransactionReceipt: jest.fn(),
  }),
  useWalletClient: () => ({
    data: {
      chain: { id: 1, name: "Ethereum" },
      writeContract: jest.fn(),
    },
  }),
  useSwitchChain: () => ({
    switchChainAsync: jest.fn(),
  }),
  useWaitForTransaction: () => ({
    data: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
  }),
  http: jest.fn(),
  createConfig: jest.fn(),
}))

// Mock viem http transport to avoid real network in tests that accidentally construct clients
jest.mock("viem", () => ({
  http: () => () => {
    throw new Error("Network error")
  },
  createPublicClient: jest.fn().mockImplementation(() => ({
    getBlockNumber: jest.fn().mockRejectedValue(new Error("HTTP request failed")),
    readContract: jest.fn().mockRejectedValue(new Error("Contract read failed")),
  })),
}))



// Mock environment variables
process.env.NEXT_PUBLIC_ALCHEMY_KEY = "test-alchemy-key"
process.env.NEXT_PUBLIC_INFURA_API_KEY = "test-infura-key"
process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID =
  "test-walletconnect-id"

// Mock window.ethereum
Object.defineProperty(window, "ethereum", {
  value: {
    request: jest.fn(),
    on: jest.fn(),
    removeListener: jest.fn(),
  },
  writable: true,
})

// Mock fetch: provide minimal Response-like object when tests don't override
global.fetch = jest
  .fn()
  .mockImplementation(
    async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input)
      // default 400s for validation tests without explicit mock
      if (url.includes("/api/coingecko-simple-price")) {
        const method = (init?.method || "GET").toUpperCase()
        if (method !== "GET") {
          return {
            ok: false,
            status: 405,
            json: async () => ({ error: "Method Not Allowed" }),
          } as any
        }
        const query = url.split("?")[1] || ""
        const idsParam = new URLSearchParams(query).get("ids")
        if (!idsParam || idsParam.trim() === "") {
          return {
            ok: false,
            status: 400,
            json: async () => ({ error: "Missing ids" }),
          } as any
        }
        // default success pass-through shape
        return {
          ok: true,
          status: 200,
          json: async () => ({}),
        } as any
      }
      return { ok: true, status: 200, json: async () => ({}) } as any
    }
  )

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}
