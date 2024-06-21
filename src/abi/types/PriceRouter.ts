export const PriceRouter = [
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
      {
        internalType: "contract Registry",
        name: "_registry",
        type: "address",
      },
      {
        internalType: "contract ERC20",
        name: "_weth",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "asset",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "maxPrice",
        type: "uint256",
      },
    ],
    name: "PriceRouter__AssetAboveMaxPrice",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "asset",
        type: "address",
      },
    ],
    name: "PriceRouter__AssetAlreadyAdded",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "asset",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "minPrice",
        type: "uint256",
      },
    ],
    name: "PriceRouter__AssetBelowMinPrice",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "asset",
        type: "address",
      },
    ],
    name: "PriceRouter__AssetNotAdded",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "asset",
        type: "address",
      },
    ],
    name: "PriceRouter__AssetNotEditable",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "asset",
        type: "address",
      },
    ],
    name: "PriceRouter__AssetNotPendingEdit",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "answer",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "expectedAnswer",
        type: "uint256",
      },
    ],
    name: "PriceRouter__BadAnswer",
    type: "error",
  },
  {
    inputs: [],
    name: "PriceRouter__BufferedMinOverflow",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "asset",
        type: "address",
      },
    ],
    name: "PriceRouter__InvalidAsset",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "maxPrice",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "bufferedMaxPrice",
        type: "uint256",
      },
    ],
    name: "PriceRouter__InvalidMaxPrice",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "minPrice",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "bufferedMinPrice",
        type: "uint256",
      },
    ],
    name: "PriceRouter__InvalidMinPrice",
    type: "error",
  },
  {
    inputs: [],
    name: "PriceRouter__LengthMismatch",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "min",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "max",
        type: "uint256",
      },
    ],
    name: "PriceRouter__MinPriceGreaterThanMaxPrice",
    type: "error",
  },
  {
    inputs: [],
    name: "PriceRouter__NewOwnerCanNotBeZero",
    type: "error",
  },
  {
    inputs: [],
    name: "PriceRouter__OnlyCallableByPendingOwner",
    type: "error",
  },
  {
    inputs: [],
    name: "PriceRouter__OnlyCallableByZeroId",
    type: "error",
  },
  {
    inputs: [],
    name: "PriceRouter__SecondsAgoDoesNotMeetMinimum",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "asset",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "timeSinceLastUpdate",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "heartbeat",
        type: "uint256",
      },
    ],
    name: "PriceRouter__StalePrice",
    type: "error",
  },
  {
    inputs: [],
    name: "PriceRouter__TransitionNotPending",
    type: "error",
  },
  {
    inputs: [],
    name: "PriceRouter__TransitionPending",
    type: "error",
  },
  {
    inputs: [],
    name: "PriceRouter__TwapAssetNotInPool",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "unknownDerivative",
        type: "uint8",
      },
    ],
    name: "PriceRouter__UnknownDerivative",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "asset",
        type: "address",
      },
    ],
    name: "PriceRouter__UnsupportedAsset",
    type: "error",
  },
  {
    inputs: [],
    name: "T",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "asset",
        type: "address",
      },
    ],
    name: "AddAsset",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "asset",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "editHash",
        type: "bytes32",
      },
    ],
    name: "EditAssetCancelled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "asset",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "editHash",
        type: "bytes32",
      },
    ],
    name: "EditAssetComplete",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "asset",
        type: "address",
      },
      {
        components: [
          {
            internalType: "uint8",
            name: "derivative",
            type: "uint8",
          },
          {
            internalType: "address",
            name: "source",
            type: "address",
          },
        ],
        indexed: false,
        internalType: "struct PriceRouter.AssetSettings",
        name: "_settings",
        type: "tuple",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "_storage",
        type: "bytes",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "editHash",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "assetEditableAt",
        type: "uint256",
      },
    ],
    name: "IntentToEditAsset",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [],
    name: "OwnerTransitionCancelled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnerTransitionComplete",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "startTime",
        type: "uint256",
      },
    ],
    name: "OwnerTransitionStarted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [],
    name: "DEFAULT_HEART_BEAT",
    outputs: [
      {
        internalType: "uint24",
        name: "",
        type: "uint24",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "EDIT_ASSET_DELAY",
    outputs: [
      {
        internalType: "uint64",
        name: "",
        type: "uint64",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "EXPECTED_ANSWER_DEVIATION",
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
    inputs: [],
    name: "MINIMUM_SECONDS_AGO",
    outputs: [
      {
        internalType: "uint32",
        name: "",
        type: "uint32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "TRANSITION_PERIOD",
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
    inputs: [],
    name: "WETH",
    outputs: [
      {
        internalType: "contract ERC20",
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
        internalType: "contract ERC20",
        name: "_asset",
        type: "address",
      },
      {
        components: [
          {
            internalType: "uint8",
            name: "derivative",
            type: "uint8",
          },
          {
            internalType: "address",
            name: "source",
            type: "address",
          },
        ],
        internalType: "struct PriceRouter.AssetSettings",
        name: "_settings",
        type: "tuple",
      },
      {
        internalType: "bytes",
        name: "_storage",
        type: "bytes",
      },
      {
        internalType: "uint256",
        name: "_expectedAnswer",
        type: "uint256",
      },
    ],
    name: "addAsset",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    name: "assetEditableTimestamp",
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
        internalType: "contract ERC20",
        name: "_asset",
        type: "address",
      },
      {
        components: [
          {
            internalType: "uint8",
            name: "derivative",
            type: "uint8",
          },
          {
            internalType: "address",
            name: "source",
            type: "address",
          },
        ],
        internalType: "struct PriceRouter.AssetSettings",
        name: "_settings",
        type: "tuple",
      },
      {
        internalType: "bytes",
        name: "_storage",
        type: "bytes",
      },
    ],
    name: "cancelEditAsset",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "cancelTransition",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract ERC20",
        name: "_asset",
        type: "address",
      },
      {
        components: [
          {
            internalType: "uint8",
            name: "derivative",
            type: "uint8",
          },
          {
            internalType: "address",
            name: "source",
            type: "address",
          },
        ],
        internalType: "struct PriceRouter.AssetSettings",
        name: "_settings",
        type: "tuple",
      },
      {
        internalType: "bytes",
        name: "_storage",
        type: "bytes",
      },
      {
        internalType: "uint256",
        name: "_expectedAnswer",
        type: "uint256",
      },
    ],
    name: "completeEditAsset",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "completeTransition",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract ERC20",
        name: "",
        type: "address",
      },
    ],
    name: "getAssetSettings",
    outputs: [
      {
        internalType: "uint8",
        name: "derivative",
        type: "uint8",
      },
      {
        internalType: "address",
        name: "source",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract ERC20",
        name: "",
        type: "address",
      },
    ],
    name: "getChainlinkDerivativeStorage",
    outputs: [
      {
        internalType: "uint144",
        name: "max",
        type: "uint144",
      },
      {
        internalType: "uint80",
        name: "min",
        type: "uint80",
      },
      {
        internalType: "uint24",
        name: "heartbeat",
        type: "uint24",
      },
      {
        internalType: "bool",
        name: "inETH",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract ERC20",
        name: "baseAsset",
        type: "address",
      },
      {
        internalType: "contract ERC20",
        name: "quoteAsset",
        type: "address",
      },
    ],
    name: "getExchangeRate",
    outputs: [
      {
        internalType: "uint256",
        name: "exchangeRate",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract ERC20[]",
        name: "baseAssets",
        type: "address[]",
      },
      {
        internalType: "contract ERC20",
        name: "quoteAsset",
        type: "address",
      },
    ],
    name: "getExchangeRates",
    outputs: [
      {
        internalType: "uint256[]",
        name: "exchangeRates",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract ERC20",
        name: "asset",
        type: "address",
      },
    ],
    name: "getPriceInUSD",
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
        internalType: "contract ERC20[]",
        name: "assets",
        type: "address[]",
      },
    ],
    name: "getPricesInUSD",
    outputs: [
      {
        internalType: "uint256[]",
        name: "prices",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract ERC20",
        name: "",
        type: "address",
      },
    ],
    name: "getTwapDerivativeStorage",
    outputs: [
      {
        internalType: "uint32",
        name: "secondsAgo",
        type: "uint32",
      },
      {
        internalType: "uint8",
        name: "baseDecimals",
        type: "uint8",
      },
      {
        internalType: "uint8",
        name: "quoteDecimals",
        type: "uint8",
      },
      {
        internalType: "contract ERC20",
        name: "quoteToken",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract ERC20",
        name: "baseAsset",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "contract ERC20",
        name: "quoteAsset",
        type: "address",
      },
    ],
    name: "getValue",
    outputs: [
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract ERC20[]",
        name: "baseAssets",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "amounts",
        type: "uint256[]",
      },
      {
        internalType: "contract ERC20",
        name: "quoteAsset",
        type: "address",
      },
    ],
    name: "getValues",
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
        internalType: "contract ERC20[]",
        name: "baseAssets0",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "amounts0",
        type: "uint256[]",
      },
      {
        internalType: "contract ERC20[]",
        name: "baseAssets1",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "amounts1",
        type: "uint256[]",
      },
      {
        internalType: "contract ERC20",
        name: "quoteAsset",
        type: "address",
      },
    ],
    name: "getValuesDelta",
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
        internalType: "contract ERC20",
        name: "asset",
        type: "address",
      },
    ],
    name: "isSupported",
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
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "pendingOwner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
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
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract ERC20",
        name: "_asset",
        type: "address",
      },
      {
        components: [
          {
            internalType: "uint8",
            name: "derivative",
            type: "uint8",
          },
          {
            internalType: "address",
            name: "source",
            type: "address",
          },
        ],
        internalType: "struct PriceRouter.AssetSettings",
        name: "_settings",
        type: "tuple",
      },
      {
        internalType: "bytes",
        name: "_storage",
        type: "bytes",
      },
    ],
    name: "startEditAsset",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transitionOwner",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "transitionStart",
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
] as const;
