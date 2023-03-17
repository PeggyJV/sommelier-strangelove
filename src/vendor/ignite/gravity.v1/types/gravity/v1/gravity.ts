/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";
import { Coin } from "../../cosmos/base/v1beta1/coin";
import { Any } from "../../google/protobuf/any";

export const protobufPackage = "gravity.v1";

/**
 * EthereumEventVoteRecord is an event that is pending of confirmation by 2/3 of
 * the signer set. The event is then attested and executed in the state machine
 * once the required threshold is met.
 */
export interface EthereumEventVoteRecord {
  event: Any | undefined;
  votes: string[];
  accepted: boolean;
}

/**
 * LatestEthereumBlockHeight defines the latest observed ethereum block height
 * and the corresponding timestamp value in nanoseconds.
 */
export interface LatestEthereumBlockHeight {
  ethereumHeight: number;
  cosmosHeight: number;
}

/**
 * EthereumSigner represents a cosmos validator with its corresponding bridge
 * operator ethereum address and its staking consensus power.
 */
export interface EthereumSigner {
  power: number;
  ethereumAddress: string;
}

/**
 * SignerSetTx is the Ethereum Bridge multisig set that relays
 * transactions the two chains. The staking validators keep ethereum keys which
 * are used to check signatures on Ethereum in order to get significant gas
 * savings.
 */
export interface SignerSetTx {
  nonce: number;
  height: number;
  signers: EthereumSigner[];
}

/**
 * BatchTx represents a batch of transactions going from Cosmos to Ethereum.
 * Batch txs are are identified by a unique hash and the token contract that is
 * shared by all the SendToEthereum
 */
export interface BatchTx {
  batchNonce: number;
  timeout: number;
  transactions: SendToEthereum[];
  tokenContract: string;
  height: number;
}

/**
 * SendToEthereum represents an individual SendToEthereum from Cosmos to
 * Ethereum
 */
export interface SendToEthereum {
  id: number;
  sender: string;
  ethereumRecipient: string;
  erc20Token: ERC20Token | undefined;
  erc20Fee: ERC20Token | undefined;
}

/**
 * ContractCallTx represents an individual arbitrary logic call transaction
 * from Cosmos to Ethereum.
 */
export interface ContractCallTx {
  invalidationNonce: number;
  invalidationScope: Uint8Array;
  address: string;
  payload: Uint8Array;
  timeout: number;
  tokens: ERC20Token[];
  fees: ERC20Token[];
  height: number;
}

export interface ERC20Token {
  contract: string;
  amount: string;
}

export interface IDSet {
  ids: number[];
}

export interface CommunityPoolEthereumSpendProposal {
  title: string;
  description: string;
  recipient: string;
  amount: Coin | undefined;
  bridgeFee: Coin | undefined;
}

/**
 * This format of the community spend Ethereum proposal is specifically for
 * the CLI to allow simple text serialization.
 */
export interface CommunityPoolEthereumSpendProposalForCLI {
  title: string;
  description: string;
  recipient: string;
  amount: string;
  bridgeFee: string;
  deposit: string;
}

function createBaseEthereumEventVoteRecord(): EthereumEventVoteRecord {
  return { event: undefined, votes: [], accepted: false };
}

export const EthereumEventVoteRecord = {
  encode(message: EthereumEventVoteRecord, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.event !== undefined) {
      Any.encode(message.event, writer.uint32(10).fork()).ldelim();
    }
    for (const v of message.votes) {
      writer.uint32(18).string(v!);
    }
    if (message.accepted === true) {
      writer.uint32(24).bool(message.accepted);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): EthereumEventVoteRecord {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseEthereumEventVoteRecord();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.event = Any.decode(reader, reader.uint32());
          break;
        case 2:
          message.votes.push(reader.string());
          break;
        case 3:
          message.accepted = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): EthereumEventVoteRecord {
    return {
      event: isSet(object.event) ? Any.fromJSON(object.event) : undefined,
      votes: Array.isArray(object?.votes) ? object.votes.map((e: any) => String(e)) : [],
      accepted: isSet(object.accepted) ? Boolean(object.accepted) : false,
    };
  },

  toJSON(message: EthereumEventVoteRecord): unknown {
    const obj: any = {};
    message.event !== undefined && (obj.event = message.event ? Any.toJSON(message.event) : undefined);
    if (message.votes) {
      obj.votes = message.votes.map((e) => e);
    } else {
      obj.votes = [];
    }
    message.accepted !== undefined && (obj.accepted = message.accepted);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<EthereumEventVoteRecord>, I>>(object: I): EthereumEventVoteRecord {
    const message = createBaseEthereumEventVoteRecord();
    message.event = (object.event !== undefined && object.event !== null) ? Any.fromPartial(object.event) : undefined;
    message.votes = object.votes?.map((e) => e) || [];
    message.accepted = object.accepted ?? false;
    return message;
  },
};

function createBaseLatestEthereumBlockHeight(): LatestEthereumBlockHeight {
  return { ethereumHeight: 0, cosmosHeight: 0 };
}

export const LatestEthereumBlockHeight = {
  encode(message: LatestEthereumBlockHeight, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.ethereumHeight !== 0) {
      writer.uint32(8).uint64(message.ethereumHeight);
    }
    if (message.cosmosHeight !== 0) {
      writer.uint32(16).uint64(message.cosmosHeight);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): LatestEthereumBlockHeight {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLatestEthereumBlockHeight();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.ethereumHeight = longToNumber(reader.uint64() as Long);
          break;
        case 2:
          message.cosmosHeight = longToNumber(reader.uint64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): LatestEthereumBlockHeight {
    return {
      ethereumHeight: isSet(object.ethereumHeight) ? Number(object.ethereumHeight) : 0,
      cosmosHeight: isSet(object.cosmosHeight) ? Number(object.cosmosHeight) : 0,
    };
  },

  toJSON(message: LatestEthereumBlockHeight): unknown {
    const obj: any = {};
    message.ethereumHeight !== undefined && (obj.ethereumHeight = Math.round(message.ethereumHeight));
    message.cosmosHeight !== undefined && (obj.cosmosHeight = Math.round(message.cosmosHeight));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<LatestEthereumBlockHeight>, I>>(object: I): LatestEthereumBlockHeight {
    const message = createBaseLatestEthereumBlockHeight();
    message.ethereumHeight = object.ethereumHeight ?? 0;
    message.cosmosHeight = object.cosmosHeight ?? 0;
    return message;
  },
};

function createBaseEthereumSigner(): EthereumSigner {
  return { power: 0, ethereumAddress: "" };
}

export const EthereumSigner = {
  encode(message: EthereumSigner, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.power !== 0) {
      writer.uint32(8).uint64(message.power);
    }
    if (message.ethereumAddress !== "") {
      writer.uint32(18).string(message.ethereumAddress);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): EthereumSigner {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseEthereumSigner();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.power = longToNumber(reader.uint64() as Long);
          break;
        case 2:
          message.ethereumAddress = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): EthereumSigner {
    return {
      power: isSet(object.power) ? Number(object.power) : 0,
      ethereumAddress: isSet(object.ethereumAddress) ? String(object.ethereumAddress) : "",
    };
  },

  toJSON(message: EthereumSigner): unknown {
    const obj: any = {};
    message.power !== undefined && (obj.power = Math.round(message.power));
    message.ethereumAddress !== undefined && (obj.ethereumAddress = message.ethereumAddress);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<EthereumSigner>, I>>(object: I): EthereumSigner {
    const message = createBaseEthereumSigner();
    message.power = object.power ?? 0;
    message.ethereumAddress = object.ethereumAddress ?? "";
    return message;
  },
};

function createBaseSignerSetTx(): SignerSetTx {
  return { nonce: 0, height: 0, signers: [] };
}

export const SignerSetTx = {
  encode(message: SignerSetTx, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.nonce !== 0) {
      writer.uint32(8).uint64(message.nonce);
    }
    if (message.height !== 0) {
      writer.uint32(16).uint64(message.height);
    }
    for (const v of message.signers) {
      EthereumSigner.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SignerSetTx {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSignerSetTx();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.nonce = longToNumber(reader.uint64() as Long);
          break;
        case 2:
          message.height = longToNumber(reader.uint64() as Long);
          break;
        case 3:
          message.signers.push(EthereumSigner.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): SignerSetTx {
    return {
      nonce: isSet(object.nonce) ? Number(object.nonce) : 0,
      height: isSet(object.height) ? Number(object.height) : 0,
      signers: Array.isArray(object?.signers) ? object.signers.map((e: any) => EthereumSigner.fromJSON(e)) : [],
    };
  },

  toJSON(message: SignerSetTx): unknown {
    const obj: any = {};
    message.nonce !== undefined && (obj.nonce = Math.round(message.nonce));
    message.height !== undefined && (obj.height = Math.round(message.height));
    if (message.signers) {
      obj.signers = message.signers.map((e) => e ? EthereumSigner.toJSON(e) : undefined);
    } else {
      obj.signers = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<SignerSetTx>, I>>(object: I): SignerSetTx {
    const message = createBaseSignerSetTx();
    message.nonce = object.nonce ?? 0;
    message.height = object.height ?? 0;
    message.signers = object.signers?.map((e) => EthereumSigner.fromPartial(e)) || [];
    return message;
  },
};

function createBaseBatchTx(): BatchTx {
  return { batchNonce: 0, timeout: 0, transactions: [], tokenContract: "", height: 0 };
}

export const BatchTx = {
  encode(message: BatchTx, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.batchNonce !== 0) {
      writer.uint32(8).uint64(message.batchNonce);
    }
    if (message.timeout !== 0) {
      writer.uint32(16).uint64(message.timeout);
    }
    for (const v of message.transactions) {
      SendToEthereum.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    if (message.tokenContract !== "") {
      writer.uint32(34).string(message.tokenContract);
    }
    if (message.height !== 0) {
      writer.uint32(40).uint64(message.height);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): BatchTx {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBatchTx();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.batchNonce = longToNumber(reader.uint64() as Long);
          break;
        case 2:
          message.timeout = longToNumber(reader.uint64() as Long);
          break;
        case 3:
          message.transactions.push(SendToEthereum.decode(reader, reader.uint32()));
          break;
        case 4:
          message.tokenContract = reader.string();
          break;
        case 5:
          message.height = longToNumber(reader.uint64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): BatchTx {
    return {
      batchNonce: isSet(object.batchNonce) ? Number(object.batchNonce) : 0,
      timeout: isSet(object.timeout) ? Number(object.timeout) : 0,
      transactions: Array.isArray(object?.transactions)
        ? object.transactions.map((e: any) => SendToEthereum.fromJSON(e))
        : [],
      tokenContract: isSet(object.tokenContract) ? String(object.tokenContract) : "",
      height: isSet(object.height) ? Number(object.height) : 0,
    };
  },

  toJSON(message: BatchTx): unknown {
    const obj: any = {};
    message.batchNonce !== undefined && (obj.batchNonce = Math.round(message.batchNonce));
    message.timeout !== undefined && (obj.timeout = Math.round(message.timeout));
    if (message.transactions) {
      obj.transactions = message.transactions.map((e) => e ? SendToEthereum.toJSON(e) : undefined);
    } else {
      obj.transactions = [];
    }
    message.tokenContract !== undefined && (obj.tokenContract = message.tokenContract);
    message.height !== undefined && (obj.height = Math.round(message.height));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<BatchTx>, I>>(object: I): BatchTx {
    const message = createBaseBatchTx();
    message.batchNonce = object.batchNonce ?? 0;
    message.timeout = object.timeout ?? 0;
    message.transactions = object.transactions?.map((e) => SendToEthereum.fromPartial(e)) || [];
    message.tokenContract = object.tokenContract ?? "";
    message.height = object.height ?? 0;
    return message;
  },
};

function createBaseSendToEthereum(): SendToEthereum {
  return { id: 0, sender: "", ethereumRecipient: "", erc20Token: undefined, erc20Fee: undefined };
}

export const SendToEthereum = {
  encode(message: SendToEthereum, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== 0) {
      writer.uint32(8).uint64(message.id);
    }
    if (message.sender !== "") {
      writer.uint32(18).string(message.sender);
    }
    if (message.ethereumRecipient !== "") {
      writer.uint32(26).string(message.ethereumRecipient);
    }
    if (message.erc20Token !== undefined) {
      ERC20Token.encode(message.erc20Token, writer.uint32(34).fork()).ldelim();
    }
    if (message.erc20Fee !== undefined) {
      ERC20Token.encode(message.erc20Fee, writer.uint32(42).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SendToEthereum {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSendToEthereum();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = longToNumber(reader.uint64() as Long);
          break;
        case 2:
          message.sender = reader.string();
          break;
        case 3:
          message.ethereumRecipient = reader.string();
          break;
        case 4:
          message.erc20Token = ERC20Token.decode(reader, reader.uint32());
          break;
        case 5:
          message.erc20Fee = ERC20Token.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): SendToEthereum {
    return {
      id: isSet(object.id) ? Number(object.id) : 0,
      sender: isSet(object.sender) ? String(object.sender) : "",
      ethereumRecipient: isSet(object.ethereumRecipient) ? String(object.ethereumRecipient) : "",
      erc20Token: isSet(object.erc20Token) ? ERC20Token.fromJSON(object.erc20Token) : undefined,
      erc20Fee: isSet(object.erc20Fee) ? ERC20Token.fromJSON(object.erc20Fee) : undefined,
    };
  },

  toJSON(message: SendToEthereum): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = Math.round(message.id));
    message.sender !== undefined && (obj.sender = message.sender);
    message.ethereumRecipient !== undefined && (obj.ethereumRecipient = message.ethereumRecipient);
    message.erc20Token !== undefined
      && (obj.erc20Token = message.erc20Token ? ERC20Token.toJSON(message.erc20Token) : undefined);
    message.erc20Fee !== undefined
      && (obj.erc20Fee = message.erc20Fee ? ERC20Token.toJSON(message.erc20Fee) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<SendToEthereum>, I>>(object: I): SendToEthereum {
    const message = createBaseSendToEthereum();
    message.id = object.id ?? 0;
    message.sender = object.sender ?? "";
    message.ethereumRecipient = object.ethereumRecipient ?? "";
    message.erc20Token = (object.erc20Token !== undefined && object.erc20Token !== null)
      ? ERC20Token.fromPartial(object.erc20Token)
      : undefined;
    message.erc20Fee = (object.erc20Fee !== undefined && object.erc20Fee !== null)
      ? ERC20Token.fromPartial(object.erc20Fee)
      : undefined;
    return message;
  },
};

function createBaseContractCallTx(): ContractCallTx {
  return {
    invalidationNonce: 0,
    invalidationScope: new Uint8Array(),
    address: "",
    payload: new Uint8Array(),
    timeout: 0,
    tokens: [],
    fees: [],
    height: 0,
  };
}

export const ContractCallTx = {
  encode(message: ContractCallTx, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.invalidationNonce !== 0) {
      writer.uint32(8).uint64(message.invalidationNonce);
    }
    if (message.invalidationScope.length !== 0) {
      writer.uint32(18).bytes(message.invalidationScope);
    }
    if (message.address !== "") {
      writer.uint32(26).string(message.address);
    }
    if (message.payload.length !== 0) {
      writer.uint32(34).bytes(message.payload);
    }
    if (message.timeout !== 0) {
      writer.uint32(40).uint64(message.timeout);
    }
    for (const v of message.tokens) {
      ERC20Token.encode(v!, writer.uint32(50).fork()).ldelim();
    }
    for (const v of message.fees) {
      ERC20Token.encode(v!, writer.uint32(58).fork()).ldelim();
    }
    if (message.height !== 0) {
      writer.uint32(64).uint64(message.height);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ContractCallTx {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseContractCallTx();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.invalidationNonce = longToNumber(reader.uint64() as Long);
          break;
        case 2:
          message.invalidationScope = reader.bytes();
          break;
        case 3:
          message.address = reader.string();
          break;
        case 4:
          message.payload = reader.bytes();
          break;
        case 5:
          message.timeout = longToNumber(reader.uint64() as Long);
          break;
        case 6:
          message.tokens.push(ERC20Token.decode(reader, reader.uint32()));
          break;
        case 7:
          message.fees.push(ERC20Token.decode(reader, reader.uint32()));
          break;
        case 8:
          message.height = longToNumber(reader.uint64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ContractCallTx {
    return {
      invalidationNonce: isSet(object.invalidationNonce) ? Number(object.invalidationNonce) : 0,
      invalidationScope: isSet(object.invalidationScope) ? bytesFromBase64(object.invalidationScope) : new Uint8Array(),
      address: isSet(object.address) ? String(object.address) : "",
      payload: isSet(object.payload) ? bytesFromBase64(object.payload) : new Uint8Array(),
      timeout: isSet(object.timeout) ? Number(object.timeout) : 0,
      tokens: Array.isArray(object?.tokens) ? object.tokens.map((e: any) => ERC20Token.fromJSON(e)) : [],
      fees: Array.isArray(object?.fees) ? object.fees.map((e: any) => ERC20Token.fromJSON(e)) : [],
      height: isSet(object.height) ? Number(object.height) : 0,
    };
  },

  toJSON(message: ContractCallTx): unknown {
    const obj: any = {};
    message.invalidationNonce !== undefined && (obj.invalidationNonce = Math.round(message.invalidationNonce));
    message.invalidationScope !== undefined
      && (obj.invalidationScope = base64FromBytes(
        message.invalidationScope !== undefined ? message.invalidationScope : new Uint8Array(),
      ));
    message.address !== undefined && (obj.address = message.address);
    message.payload !== undefined
      && (obj.payload = base64FromBytes(message.payload !== undefined ? message.payload : new Uint8Array()));
    message.timeout !== undefined && (obj.timeout = Math.round(message.timeout));
    if (message.tokens) {
      obj.tokens = message.tokens.map((e) => e ? ERC20Token.toJSON(e) : undefined);
    } else {
      obj.tokens = [];
    }
    if (message.fees) {
      obj.fees = message.fees.map((e) => e ? ERC20Token.toJSON(e) : undefined);
    } else {
      obj.fees = [];
    }
    message.height !== undefined && (obj.height = Math.round(message.height));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<ContractCallTx>, I>>(object: I): ContractCallTx {
    const message = createBaseContractCallTx();
    message.invalidationNonce = object.invalidationNonce ?? 0;
    message.invalidationScope = object.invalidationScope ?? new Uint8Array();
    message.address = object.address ?? "";
    message.payload = object.payload ?? new Uint8Array();
    message.timeout = object.timeout ?? 0;
    message.tokens = object.tokens?.map((e) => ERC20Token.fromPartial(e)) || [];
    message.fees = object.fees?.map((e) => ERC20Token.fromPartial(e)) || [];
    message.height = object.height ?? 0;
    return message;
  },
};

function createBaseERC20Token(): ERC20Token {
  return { contract: "", amount: "" };
}

export const ERC20Token = {
  encode(message: ERC20Token, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.contract !== "") {
      writer.uint32(10).string(message.contract);
    }
    if (message.amount !== "") {
      writer.uint32(18).string(message.amount);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ERC20Token {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseERC20Token();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.contract = reader.string();
          break;
        case 2:
          message.amount = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ERC20Token {
    return {
      contract: isSet(object.contract) ? String(object.contract) : "",
      amount: isSet(object.amount) ? String(object.amount) : "",
    };
  },

  toJSON(message: ERC20Token): unknown {
    const obj: any = {};
    message.contract !== undefined && (obj.contract = message.contract);
    message.amount !== undefined && (obj.amount = message.amount);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<ERC20Token>, I>>(object: I): ERC20Token {
    const message = createBaseERC20Token();
    message.contract = object.contract ?? "";
    message.amount = object.amount ?? "";
    return message;
  },
};

function createBaseIDSet(): IDSet {
  return { ids: [] };
}

export const IDSet = {
  encode(message: IDSet, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    writer.uint32(10).fork();
    for (const v of message.ids) {
      writer.uint64(v);
    }
    writer.ldelim();
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): IDSet {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseIDSet();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if ((tag & 7) === 2) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.ids.push(longToNumber(reader.uint64() as Long));
            }
          } else {
            message.ids.push(longToNumber(reader.uint64() as Long));
          }
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): IDSet {
    return { ids: Array.isArray(object?.ids) ? object.ids.map((e: any) => Number(e)) : [] };
  },

  toJSON(message: IDSet): unknown {
    const obj: any = {};
    if (message.ids) {
      obj.ids = message.ids.map((e) => Math.round(e));
    } else {
      obj.ids = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<IDSet>, I>>(object: I): IDSet {
    const message = createBaseIDSet();
    message.ids = object.ids?.map((e) => e) || [];
    return message;
  },
};

function createBaseCommunityPoolEthereumSpendProposal(): CommunityPoolEthereumSpendProposal {
  return { title: "", description: "", recipient: "", amount: undefined, bridgeFee: undefined };
}

export const CommunityPoolEthereumSpendProposal = {
  encode(message: CommunityPoolEthereumSpendProposal, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.title !== "") {
      writer.uint32(10).string(message.title);
    }
    if (message.description !== "") {
      writer.uint32(18).string(message.description);
    }
    if (message.recipient !== "") {
      writer.uint32(26).string(message.recipient);
    }
    if (message.amount !== undefined) {
      Coin.encode(message.amount, writer.uint32(34).fork()).ldelim();
    }
    if (message.bridgeFee !== undefined) {
      Coin.encode(message.bridgeFee, writer.uint32(42).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CommunityPoolEthereumSpendProposal {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCommunityPoolEthereumSpendProposal();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.title = reader.string();
          break;
        case 2:
          message.description = reader.string();
          break;
        case 3:
          message.recipient = reader.string();
          break;
        case 4:
          message.amount = Coin.decode(reader, reader.uint32());
          break;
        case 5:
          message.bridgeFee = Coin.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CommunityPoolEthereumSpendProposal {
    return {
      title: isSet(object.title) ? String(object.title) : "",
      description: isSet(object.description) ? String(object.description) : "",
      recipient: isSet(object.recipient) ? String(object.recipient) : "",
      amount: isSet(object.amount) ? Coin.fromJSON(object.amount) : undefined,
      bridgeFee: isSet(object.bridgeFee) ? Coin.fromJSON(object.bridgeFee) : undefined,
    };
  },

  toJSON(message: CommunityPoolEthereumSpendProposal): unknown {
    const obj: any = {};
    message.title !== undefined && (obj.title = message.title);
    message.description !== undefined && (obj.description = message.description);
    message.recipient !== undefined && (obj.recipient = message.recipient);
    message.amount !== undefined && (obj.amount = message.amount ? Coin.toJSON(message.amount) : undefined);
    message.bridgeFee !== undefined && (obj.bridgeFee = message.bridgeFee ? Coin.toJSON(message.bridgeFee) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<CommunityPoolEthereumSpendProposal>, I>>(
    object: I,
  ): CommunityPoolEthereumSpendProposal {
    const message = createBaseCommunityPoolEthereumSpendProposal();
    message.title = object.title ?? "";
    message.description = object.description ?? "";
    message.recipient = object.recipient ?? "";
    message.amount = (object.amount !== undefined && object.amount !== null)
      ? Coin.fromPartial(object.amount)
      : undefined;
    message.bridgeFee = (object.bridgeFee !== undefined && object.bridgeFee !== null)
      ? Coin.fromPartial(object.bridgeFee)
      : undefined;
    return message;
  },
};

function createBaseCommunityPoolEthereumSpendProposalForCLI(): CommunityPoolEthereumSpendProposalForCLI {
  return { title: "", description: "", recipient: "", amount: "", bridgeFee: "", deposit: "" };
}

export const CommunityPoolEthereumSpendProposalForCLI = {
  encode(message: CommunityPoolEthereumSpendProposalForCLI, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.title !== "") {
      writer.uint32(10).string(message.title);
    }
    if (message.description !== "") {
      writer.uint32(18).string(message.description);
    }
    if (message.recipient !== "") {
      writer.uint32(26).string(message.recipient);
    }
    if (message.amount !== "") {
      writer.uint32(34).string(message.amount);
    }
    if (message.bridgeFee !== "") {
      writer.uint32(42).string(message.bridgeFee);
    }
    if (message.deposit !== "") {
      writer.uint32(50).string(message.deposit);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CommunityPoolEthereumSpendProposalForCLI {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCommunityPoolEthereumSpendProposalForCLI();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.title = reader.string();
          break;
        case 2:
          message.description = reader.string();
          break;
        case 3:
          message.recipient = reader.string();
          break;
        case 4:
          message.amount = reader.string();
          break;
        case 5:
          message.bridgeFee = reader.string();
          break;
        case 6:
          message.deposit = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CommunityPoolEthereumSpendProposalForCLI {
    return {
      title: isSet(object.title) ? String(object.title) : "",
      description: isSet(object.description) ? String(object.description) : "",
      recipient: isSet(object.recipient) ? String(object.recipient) : "",
      amount: isSet(object.amount) ? String(object.amount) : "",
      bridgeFee: isSet(object.bridgeFee) ? String(object.bridgeFee) : "",
      deposit: isSet(object.deposit) ? String(object.deposit) : "",
    };
  },

  toJSON(message: CommunityPoolEthereumSpendProposalForCLI): unknown {
    const obj: any = {};
    message.title !== undefined && (obj.title = message.title);
    message.description !== undefined && (obj.description = message.description);
    message.recipient !== undefined && (obj.recipient = message.recipient);
    message.amount !== undefined && (obj.amount = message.amount);
    message.bridgeFee !== undefined && (obj.bridgeFee = message.bridgeFee);
    message.deposit !== undefined && (obj.deposit = message.deposit);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<CommunityPoolEthereumSpendProposalForCLI>, I>>(
    object: I,
  ): CommunityPoolEthereumSpendProposalForCLI {
    const message = createBaseCommunityPoolEthereumSpendProposalForCLI();
    message.title = object.title ?? "";
    message.description = object.description ?? "";
    message.recipient = object.recipient ?? "";
    message.amount = object.amount ?? "";
    message.bridgeFee = object.bridgeFee ?? "";
    message.deposit = object.deposit ?? "";
    return message;
  },
};

declare var self: any | undefined;
declare var window: any | undefined;
declare var global: any | undefined;
var globalThis: any = (() => {
  if (typeof globalThis !== "undefined") {
    return globalThis;
  }
  if (typeof self !== "undefined") {
    return self;
  }
  if (typeof window !== "undefined") {
    return window;
  }
  if (typeof global !== "undefined") {
    return global;
  }
  throw "Unable to locate global object";
})();

function bytesFromBase64(b64: string): Uint8Array {
  if (globalThis.Buffer) {
    return Uint8Array.from(globalThis.Buffer.from(b64, "base64"));
  } else {
    const bin = globalThis.atob(b64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; ++i) {
      arr[i] = bin.charCodeAt(i);
    }
    return arr;
  }
}

function base64FromBytes(arr: Uint8Array): string {
  if (globalThis.Buffer) {
    return globalThis.Buffer.from(arr).toString("base64");
  } else {
    const bin: string[] = [];
    arr.forEach((byte) => {
      bin.push(String.fromCharCode(byte));
    });
    return globalThis.btoa(bin.join(""));
  }
}

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function longToNumber(long: Long): number {
  if (long.gt(Number.MAX_SAFE_INTEGER)) {
    throw new globalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
  }
  return long.toNumber();
}

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
