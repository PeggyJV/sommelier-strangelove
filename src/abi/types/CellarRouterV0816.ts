export const CellarRouterV0816 = [
  {
    inputs: [
      {
        internalType: "contract Registry",
        name: "_registry",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "signatureLength",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "expectedSignatureLength",
        type: "uint256",
      },
    ],
    name: "CellarRouter__InvalidSignature",
    type: "error",
  },
  {
    inputs: [],
    name: "SWAP_ROUTER_REGISTRY_SLOT",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract Cellar",
        name: "cellar",
        type: "address",
      },
      {
        internalType: "enum SwapRouter.Exchange",
        name: "exchange",
        type: "uint8",
      },
      {
        internalType: "bytes",
        name: "swapData",
        type: "bytes",
      },
      {
        internalType: "uint256",
        name: "assets",
        type: "uint256",
      },
      {
        internalType: "contract ERC20",
        name: "assetIn",
        type: "address",
      },
    ],
    name: "depositAndSwap",
    outputs: [
      {
        internalType: "uint256",
        name: "shares",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract Cellar",
        name: "cellar",
        type: "address",
      },
      {
        internalType: "enum SwapRouter.Exchange",
        name: "exchange",
        type: "uint8",
      },
      {
        internalType: "bytes",
        name: "swapData",
        type: "bytes",
      },
      {
        internalType: "uint256",
        name: "assets",
        type: "uint256",
      },
      {
        internalType: "contract ERC20",
        name: "assetIn",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "deadline",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "signature",
        type: "bytes",
      },
    ],
    name: "depositAndSwapWithPermit",
    outputs: [
      {
        internalType: "uint256",
        name: "shares",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract Cellar",
        name: "cellar",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "assets",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "deadline",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "signature",
        type: "bytes",
      },
    ],
    name: "depositWithPermit",
    outputs: [
      {
        internalType: "uint256",
        name: "shares",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "registry",
    outputs: [
      {
        internalType: "contract Registry",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract Cellar",
        name: "cellar",
        type: "address",
      },
      {
        internalType: "enum SwapRouter.Exchange[]",
        name: "exchanges",
        type: "uint8[]",
      },
      {
        internalType: "bytes[]",
        name: "swapDatas",
        type: "bytes[]",
      },
      {
        internalType: "uint256",
        name: "assets",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "receiver",
        type: "address",
      },
    ],
    name: "withdrawAndSwap",
    outputs: [
      {
        internalType: "uint256",
        name: "shares",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract Cellar",
        name: "cellar",
        type: "address",
      },
      {
        internalType: "enum SwapRouter.Exchange[]",
        name: "exchanges",
        type: "uint8[]",
      },
      {
        internalType: "bytes[]",
        name: "swapDatas",
        type: "bytes[]",
      },
      {
        internalType: "uint256",
        name: "sharesToRedeem",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "deadline",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "signature",
        type: "bytes",
      },
      {
        internalType: "address",
        name: "receiver",
        type: "address",
      },
    ],
    name: "withdrawAndSwapWithPermit",
    outputs: [
      {
        internalType: "uint256",
        name: "shares",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
