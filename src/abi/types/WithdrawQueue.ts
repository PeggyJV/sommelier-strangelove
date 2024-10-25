export const WithdrawQueue = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "WithdrawQueue__NoShares",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "WithdrawQueue__RequestDeadlineExceeded",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "WithdrawQueue__UserNotInSolve",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "WithdrawQueue__UserRepeated",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "share",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "sharesSpent",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "assetsReceived",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "RequestFulfilled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "share",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "deadline",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "minPrice",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "RequestUpdated",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        internalType: "contract ERC4626",
        name: "share",
        type: "address",
      },
    ],
    name: "getUserWithdrawRequest",
    outputs: [
      {
        components: [
          {
            internalType: "uint64",
            name: "deadline",
            type: "uint64",
          },
          {
            internalType: "uint88",
            name: "executionSharePrice",
            type: "uint88",
          },
          {
            internalType: "uint96",
            name: "sharesToWithdraw",
            type: "uint96",
          },
          {
            internalType: "bool",
            name: "inSolve",
            type: "bool",
          },
        ],
        internalType: "struct WithdrawQueue.WithdrawRequest",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract ERC4626",
        name: "share",
        type: "address",
      },
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        components: [
          {
            internalType: "uint64",
            name: "deadline",
            type: "uint64",
          },
          {
            internalType: "uint88",
            name: "executionSharePrice",
            type: "uint88",
          },
          {
            internalType: "uint96",
            name: "sharesToWithdraw",
            type: "uint96",
          },
          {
            internalType: "bool",
            name: "inSolve",
            type: "bool",
          },
        ],
        internalType: "struct WithdrawQueue.WithdrawRequest",
        name: "userRequest",
        type: "tuple",
      },
    ],
    name: "isWithdrawRequestValid",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract ERC4626",
        name: "share",
        type: "address",
      },
      {
        internalType: "address[]",
        name: "users",
        type: "address[]",
      },
      {
        internalType: "bytes",
        name: "runData",
        type: "bytes",
      },
      {
        internalType: "address",
        name: "solver",
        type: "address",
      },
    ],
    name: "solve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract ERC4626",
        name: "share",
        type: "address",
      },
      {
        components: [
          {
            internalType: "uint64",
            name: "deadline",
            type: "uint64",
          },
          {
            internalType: "uint88",
            name: "executionSharePrice",
            type: "uint88",
          },
          {
            internalType: "uint96",
            name: "sharesToWithdraw",
            type: "uint96",
          },
          {
            internalType: "bool",
            name: "inSolve",
            type: "bool",
          },
        ],
        internalType: "struct WithdrawQueue.WithdrawRequest",
        name: "userRequest",
        type: "tuple",
      },
    ],
    name: "updateWithdrawRequest",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "contract ERC4626",
        name: "",
        type: "address",
      },
    ],
    name: "userWithdrawRequest",
    outputs: [
      {
        internalType: "uint64",
        name: "deadline",
        type: "uint64",
      },
      {
        internalType: "uint88",
        name: "executionSharePrice",
        type: "uint88",
      },
      {
        internalType: "uint96",
        name: "sharesToWithdraw",
        type: "uint96",
      },
      {
        internalType: "bool",
        name: "inSolve",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract ERC4626",
        name: "share",
        type: "address",
      },
      {
        internalType: "address[]",
        name: "users",
        type: "address[]",
      },
    ],
    name: "viewSolveMetaData",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            internalType: "uint8",
            name: "flags",
            type: "uint8",
          },
          {
            internalType: "uint256",
            name: "sharesToSolve",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "requiredAssets",
            type: "uint256",
          },
        ],
        internalType: "struct WithdrawQueue.SolveMetaData[]",
        name: "metaData",
        type: "tuple[]",
      },
      {
        internalType: "uint256",
        name: "totalRequiredAssets",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "totalSharesToSolve",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;
