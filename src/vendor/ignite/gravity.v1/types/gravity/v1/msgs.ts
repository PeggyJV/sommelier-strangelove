/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";
import { Coin } from "../../cosmos/base/v1beta1/coin";
import { Any } from "../../google/protobuf/any";
import { EthereumSigner } from "./gravity";

export const protobufPackage = "gravity.v1";

/**
 * MsgSendToEthereum submits a SendToEthereum attempt to bridge an asset over to
 * Ethereum. The SendToEthereum will be stored and then included in a batch and
 * then submitted to Ethereum.
 */
export interface MsgSendToEthereum {
  sender: string;
  ethereumRecipient: string;
  amount: Coin | undefined;
  bridgeFee: Coin | undefined;
}

/**
 * MsgSendToEthereumResponse returns the SendToEthereum transaction ID which
 * will be included in the batch tx.
 */
export interface MsgSendToEthereumResponse {
  id: number;
}

/**
 * MsgCancelSendToEthereum allows the sender to cancel its own outgoing
 * SendToEthereum tx and recieve a refund of the tokens and bridge fees. This tx
 * will only succeed if the SendToEthereum tx hasn't been batched to be
 * processed and relayed to Ethereum.
 */
export interface MsgCancelSendToEthereum {
  id: number;
  sender: string;
}

export interface MsgCancelSendToEthereumResponse {
}

/**
 * MsgRequestBatchTx requests a batch of transactions with a given coin
 * denomination to send across the bridge to Ethereum.
 */
export interface MsgRequestBatchTx {
  denom: string;
  signer: string;
}

export interface MsgRequestBatchTxResponse {
}

/**
 * MsgSubmitEthereumTxConfirmation submits an ethereum signature for a given
 * validator
 */
export interface MsgSubmitEthereumTxConfirmation {
  /** TODO: can we make this take an array? */
  confirmation: Any | undefined;
  signer: string;
}

/**
 * ContractCallTxConfirmation is a signature on behalf of a validator for a
 * ContractCallTx.
 */
export interface ContractCallTxConfirmation {
  invalidationScope: Uint8Array;
  invalidationNonce: number;
  ethereumSigner: string;
  signature: Uint8Array;
}

/** BatchTxConfirmation is a signature on behalf of a validator for a BatchTx. */
export interface BatchTxConfirmation {
  tokenContract: string;
  batchNonce: number;
  ethereumSigner: string;
  signature: Uint8Array;
}

/**
 * SignerSetTxConfirmation is a signature on behalf of a validator for a
 * SignerSetTx
 */
export interface SignerSetTxConfirmation {
  signerSetNonce: number;
  ethereumSigner: string;
  signature: Uint8Array;
}

export interface MsgSubmitEthereumTxConfirmationResponse {
}

/** MsgSubmitEthereumEvent */
export interface MsgSubmitEthereumEvent {
  event: Any | undefined;
  signer: string;
}

export interface MsgSubmitEthereumEventResponse {
}

/**
 * MsgDelegateKey allows validators to delegate their voting responsibilities
 * to a given orchestrator address. This key is then used as an optional
 * authentication method for attesting events from Ethereum.
 */
export interface MsgDelegateKeys {
  validatorAddress: string;
  orchestratorAddress: string;
  ethereumAddress: string;
  ethSignature: Uint8Array;
}

export interface MsgDelegateKeysResponse {
}

/**
 * DelegateKeysSignMsg defines the message structure an operator is expected to
 * sign when submitting a MsgDelegateKeys message. The resulting signature
 * should populate the eth_signature field.
 */
export interface DelegateKeysSignMsg {
  validatorAddress: string;
  nonce: number;
}

/**
 * Periodic update of latest observed Ethereum and Cosmos heights from the
 * orchestrator
 */
export interface MsgEthereumHeightVote {
  ethereumHeight: number;
  signer: string;
}

export interface MsgEthereumHeightVoteResponse {
}

/**
 * SendToCosmosEvent is submitted when the SendToCosmosEvent is emitted by they
 * gravity contract. ERC20 representation coins are minted to the cosmosreceiver
 * address.
 */
export interface SendToCosmosEvent {
  eventNonce: number;
  tokenContract: string;
  amount: string;
  ethereumSender: string;
  cosmosReceiver: string;
  ethereumHeight: number;
}

/**
 * BatchExecutedEvent claims that a batch of BatchTxExecutedal operations on the
 * bridge contract was executed successfully on ETH
 */
export interface BatchExecutedEvent {
  tokenContract: string;
  eventNonce: number;
  ethereumHeight: number;
  batchNonce: number;
}

/**
 * NOTE: bytes.HexBytes is supposed to "help" with json encoding/decoding
 * investigate?
 */
export interface ContractCallExecutedEvent {
  eventNonce: number;
  invalidationScope: Uint8Array;
  invalidationNonce: number;
  ethereumHeight: number;
}

/**
 * ERC20DeployedEvent is submitted when an ERC20 contract
 * for a Cosmos SDK coin has been deployed on Ethereum.
 */
export interface ERC20DeployedEvent {
  eventNonce: number;
  cosmosDenom: string;
  tokenContract: string;
  erc20Name: string;
  erc20Symbol: string;
  erc20Decimals: number;
  ethereumHeight: number;
}

/**
 * This informs the Cosmos module that a validator
 * set has been updated.
 */
export interface SignerSetTxExecutedEvent {
  eventNonce: number;
  signerSetTxNonce: number;
  ethereumHeight: number;
  members: EthereumSigner[];
}

function createBaseMsgSendToEthereum(): MsgSendToEthereum {
  return { sender: "", ethereumRecipient: "", amount: undefined, bridgeFee: undefined };
}

export const MsgSendToEthereum = {
  encode(message: MsgSendToEthereum, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.sender !== "") {
      writer.uint32(10).string(message.sender);
    }
    if (message.ethereumRecipient !== "") {
      writer.uint32(18).string(message.ethereumRecipient);
    }
    if (message.amount !== undefined) {
      Coin.encode(message.amount, writer.uint32(26).fork()).ldelim();
    }
    if (message.bridgeFee !== undefined) {
      Coin.encode(message.bridgeFee, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgSendToEthereum {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgSendToEthereum();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.sender = reader.string();
          break;
        case 2:
          message.ethereumRecipient = reader.string();
          break;
        case 3:
          message.amount = Coin.decode(reader, reader.uint32());
          break;
        case 4:
          message.bridgeFee = Coin.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgSendToEthereum {
    return {
      sender: isSet(object.sender) ? String(object.sender) : "",
      ethereumRecipient: isSet(object.ethereumRecipient) ? String(object.ethereumRecipient) : "",
      amount: isSet(object.amount) ? Coin.fromJSON(object.amount) : undefined,
      bridgeFee: isSet(object.bridgeFee) ? Coin.fromJSON(object.bridgeFee) : undefined,
    };
  },

  toJSON(message: MsgSendToEthereum): unknown {
    const obj: any = {};
    message.sender !== undefined && (obj.sender = message.sender);
    message.ethereumRecipient !== undefined && (obj.ethereumRecipient = message.ethereumRecipient);
    message.amount !== undefined && (obj.amount = message.amount ? Coin.toJSON(message.amount) : undefined);
    message.bridgeFee !== undefined && (obj.bridgeFee = message.bridgeFee ? Coin.toJSON(message.bridgeFee) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MsgSendToEthereum>, I>>(object: I): MsgSendToEthereum {
    const message = createBaseMsgSendToEthereum();
    message.sender = object.sender ?? "";
    message.ethereumRecipient = object.ethereumRecipient ?? "";
    message.amount = (object.amount !== undefined && object.amount !== null)
      ? Coin.fromPartial(object.amount)
      : undefined;
    message.bridgeFee = (object.bridgeFee !== undefined && object.bridgeFee !== null)
      ? Coin.fromPartial(object.bridgeFee)
      : undefined;
    return message;
  },
};

function createBaseMsgSendToEthereumResponse(): MsgSendToEthereumResponse {
  return { id: 0 };
}

export const MsgSendToEthereumResponse = {
  encode(message: MsgSendToEthereumResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== 0) {
      writer.uint32(8).uint64(message.id);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgSendToEthereumResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgSendToEthereumResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = longToNumber(reader.uint64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgSendToEthereumResponse {
    return { id: isSet(object.id) ? Number(object.id) : 0 };
  },

  toJSON(message: MsgSendToEthereumResponse): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = Math.round(message.id));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MsgSendToEthereumResponse>, I>>(object: I): MsgSendToEthereumResponse {
    const message = createBaseMsgSendToEthereumResponse();
    message.id = object.id ?? 0;
    return message;
  },
};

function createBaseMsgCancelSendToEthereum(): MsgCancelSendToEthereum {
  return { id: 0, sender: "" };
}

export const MsgCancelSendToEthereum = {
  encode(message: MsgCancelSendToEthereum, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== 0) {
      writer.uint32(8).uint64(message.id);
    }
    if (message.sender !== "") {
      writer.uint32(18).string(message.sender);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgCancelSendToEthereum {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgCancelSendToEthereum();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = longToNumber(reader.uint64() as Long);
          break;
        case 2:
          message.sender = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgCancelSendToEthereum {
    return { id: isSet(object.id) ? Number(object.id) : 0, sender: isSet(object.sender) ? String(object.sender) : "" };
  },

  toJSON(message: MsgCancelSendToEthereum): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = Math.round(message.id));
    message.sender !== undefined && (obj.sender = message.sender);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MsgCancelSendToEthereum>, I>>(object: I): MsgCancelSendToEthereum {
    const message = createBaseMsgCancelSendToEthereum();
    message.id = object.id ?? 0;
    message.sender = object.sender ?? "";
    return message;
  },
};

function createBaseMsgCancelSendToEthereumResponse(): MsgCancelSendToEthereumResponse {
  return {};
}

export const MsgCancelSendToEthereumResponse = {
  encode(_: MsgCancelSendToEthereumResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgCancelSendToEthereumResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgCancelSendToEthereumResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): MsgCancelSendToEthereumResponse {
    return {};
  },

  toJSON(_: MsgCancelSendToEthereumResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MsgCancelSendToEthereumResponse>, I>>(_: I): MsgCancelSendToEthereumResponse {
    const message = createBaseMsgCancelSendToEthereumResponse();
    return message;
  },
};

function createBaseMsgRequestBatchTx(): MsgRequestBatchTx {
  return { denom: "", signer: "" };
}

export const MsgRequestBatchTx = {
  encode(message: MsgRequestBatchTx, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.denom !== "") {
      writer.uint32(10).string(message.denom);
    }
    if (message.signer !== "") {
      writer.uint32(18).string(message.signer);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgRequestBatchTx {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgRequestBatchTx();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.denom = reader.string();
          break;
        case 2:
          message.signer = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgRequestBatchTx {
    return {
      denom: isSet(object.denom) ? String(object.denom) : "",
      signer: isSet(object.signer) ? String(object.signer) : "",
    };
  },

  toJSON(message: MsgRequestBatchTx): unknown {
    const obj: any = {};
    message.denom !== undefined && (obj.denom = message.denom);
    message.signer !== undefined && (obj.signer = message.signer);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MsgRequestBatchTx>, I>>(object: I): MsgRequestBatchTx {
    const message = createBaseMsgRequestBatchTx();
    message.denom = object.denom ?? "";
    message.signer = object.signer ?? "";
    return message;
  },
};

function createBaseMsgRequestBatchTxResponse(): MsgRequestBatchTxResponse {
  return {};
}

export const MsgRequestBatchTxResponse = {
  encode(_: MsgRequestBatchTxResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgRequestBatchTxResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgRequestBatchTxResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): MsgRequestBatchTxResponse {
    return {};
  },

  toJSON(_: MsgRequestBatchTxResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MsgRequestBatchTxResponse>, I>>(_: I): MsgRequestBatchTxResponse {
    const message = createBaseMsgRequestBatchTxResponse();
    return message;
  },
};

function createBaseMsgSubmitEthereumTxConfirmation(): MsgSubmitEthereumTxConfirmation {
  return { confirmation: undefined, signer: "" };
}

export const MsgSubmitEthereumTxConfirmation = {
  encode(message: MsgSubmitEthereumTxConfirmation, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.confirmation !== undefined) {
      Any.encode(message.confirmation, writer.uint32(10).fork()).ldelim();
    }
    if (message.signer !== "") {
      writer.uint32(18).string(message.signer);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgSubmitEthereumTxConfirmation {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgSubmitEthereumTxConfirmation();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.confirmation = Any.decode(reader, reader.uint32());
          break;
        case 2:
          message.signer = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgSubmitEthereumTxConfirmation {
    return {
      confirmation: isSet(object.confirmation) ? Any.fromJSON(object.confirmation) : undefined,
      signer: isSet(object.signer) ? String(object.signer) : "",
    };
  },

  toJSON(message: MsgSubmitEthereumTxConfirmation): unknown {
    const obj: any = {};
    message.confirmation !== undefined
      && (obj.confirmation = message.confirmation ? Any.toJSON(message.confirmation) : undefined);
    message.signer !== undefined && (obj.signer = message.signer);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MsgSubmitEthereumTxConfirmation>, I>>(
    object: I,
  ): MsgSubmitEthereumTxConfirmation {
    const message = createBaseMsgSubmitEthereumTxConfirmation();
    message.confirmation = (object.confirmation !== undefined && object.confirmation !== null)
      ? Any.fromPartial(object.confirmation)
      : undefined;
    message.signer = object.signer ?? "";
    return message;
  },
};

function createBaseContractCallTxConfirmation(): ContractCallTxConfirmation {
  return { invalidationScope: new Uint8Array(), invalidationNonce: 0, ethereumSigner: "", signature: new Uint8Array() };
}

export const ContractCallTxConfirmation = {
  encode(message: ContractCallTxConfirmation, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.invalidationScope.length !== 0) {
      writer.uint32(10).bytes(message.invalidationScope);
    }
    if (message.invalidationNonce !== 0) {
      writer.uint32(16).uint64(message.invalidationNonce);
    }
    if (message.ethereumSigner !== "") {
      writer.uint32(26).string(message.ethereumSigner);
    }
    if (message.signature.length !== 0) {
      writer.uint32(34).bytes(message.signature);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ContractCallTxConfirmation {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseContractCallTxConfirmation();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.invalidationScope = reader.bytes();
          break;
        case 2:
          message.invalidationNonce = longToNumber(reader.uint64() as Long);
          break;
        case 3:
          message.ethereumSigner = reader.string();
          break;
        case 4:
          message.signature = reader.bytes();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ContractCallTxConfirmation {
    return {
      invalidationScope: isSet(object.invalidationScope) ? bytesFromBase64(object.invalidationScope) : new Uint8Array(),
      invalidationNonce: isSet(object.invalidationNonce) ? Number(object.invalidationNonce) : 0,
      ethereumSigner: isSet(object.ethereumSigner) ? String(object.ethereumSigner) : "",
      signature: isSet(object.signature) ? bytesFromBase64(object.signature) : new Uint8Array(),
    };
  },

  toJSON(message: ContractCallTxConfirmation): unknown {
    const obj: any = {};
    message.invalidationScope !== undefined
      && (obj.invalidationScope = base64FromBytes(
        message.invalidationScope !== undefined ? message.invalidationScope : new Uint8Array(),
      ));
    message.invalidationNonce !== undefined && (obj.invalidationNonce = Math.round(message.invalidationNonce));
    message.ethereumSigner !== undefined && (obj.ethereumSigner = message.ethereumSigner);
    message.signature !== undefined
      && (obj.signature = base64FromBytes(message.signature !== undefined ? message.signature : new Uint8Array()));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<ContractCallTxConfirmation>, I>>(object: I): ContractCallTxConfirmation {
    const message = createBaseContractCallTxConfirmation();
    message.invalidationScope = object.invalidationScope ?? new Uint8Array();
    message.invalidationNonce = object.invalidationNonce ?? 0;
    message.ethereumSigner = object.ethereumSigner ?? "";
    message.signature = object.signature ?? new Uint8Array();
    return message;
  },
};

function createBaseBatchTxConfirmation(): BatchTxConfirmation {
  return { tokenContract: "", batchNonce: 0, ethereumSigner: "", signature: new Uint8Array() };
}

export const BatchTxConfirmation = {
  encode(message: BatchTxConfirmation, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.tokenContract !== "") {
      writer.uint32(10).string(message.tokenContract);
    }
    if (message.batchNonce !== 0) {
      writer.uint32(16).uint64(message.batchNonce);
    }
    if (message.ethereumSigner !== "") {
      writer.uint32(26).string(message.ethereumSigner);
    }
    if (message.signature.length !== 0) {
      writer.uint32(34).bytes(message.signature);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): BatchTxConfirmation {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBatchTxConfirmation();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.tokenContract = reader.string();
          break;
        case 2:
          message.batchNonce = longToNumber(reader.uint64() as Long);
          break;
        case 3:
          message.ethereumSigner = reader.string();
          break;
        case 4:
          message.signature = reader.bytes();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): BatchTxConfirmation {
    return {
      tokenContract: isSet(object.tokenContract) ? String(object.tokenContract) : "",
      batchNonce: isSet(object.batchNonce) ? Number(object.batchNonce) : 0,
      ethereumSigner: isSet(object.ethereumSigner) ? String(object.ethereumSigner) : "",
      signature: isSet(object.signature) ? bytesFromBase64(object.signature) : new Uint8Array(),
    };
  },

  toJSON(message: BatchTxConfirmation): unknown {
    const obj: any = {};
    message.tokenContract !== undefined && (obj.tokenContract = message.tokenContract);
    message.batchNonce !== undefined && (obj.batchNonce = Math.round(message.batchNonce));
    message.ethereumSigner !== undefined && (obj.ethereumSigner = message.ethereumSigner);
    message.signature !== undefined
      && (obj.signature = base64FromBytes(message.signature !== undefined ? message.signature : new Uint8Array()));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<BatchTxConfirmation>, I>>(object: I): BatchTxConfirmation {
    const message = createBaseBatchTxConfirmation();
    message.tokenContract = object.tokenContract ?? "";
    message.batchNonce = object.batchNonce ?? 0;
    message.ethereumSigner = object.ethereumSigner ?? "";
    message.signature = object.signature ?? new Uint8Array();
    return message;
  },
};

function createBaseSignerSetTxConfirmation(): SignerSetTxConfirmation {
  return { signerSetNonce: 0, ethereumSigner: "", signature: new Uint8Array() };
}

export const SignerSetTxConfirmation = {
  encode(message: SignerSetTxConfirmation, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.signerSetNonce !== 0) {
      writer.uint32(8).uint64(message.signerSetNonce);
    }
    if (message.ethereumSigner !== "") {
      writer.uint32(18).string(message.ethereumSigner);
    }
    if (message.signature.length !== 0) {
      writer.uint32(26).bytes(message.signature);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SignerSetTxConfirmation {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSignerSetTxConfirmation();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.signerSetNonce = longToNumber(reader.uint64() as Long);
          break;
        case 2:
          message.ethereumSigner = reader.string();
          break;
        case 3:
          message.signature = reader.bytes();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): SignerSetTxConfirmation {
    return {
      signerSetNonce: isSet(object.signerSetNonce) ? Number(object.signerSetNonce) : 0,
      ethereumSigner: isSet(object.ethereumSigner) ? String(object.ethereumSigner) : "",
      signature: isSet(object.signature) ? bytesFromBase64(object.signature) : new Uint8Array(),
    };
  },

  toJSON(message: SignerSetTxConfirmation): unknown {
    const obj: any = {};
    message.signerSetNonce !== undefined && (obj.signerSetNonce = Math.round(message.signerSetNonce));
    message.ethereumSigner !== undefined && (obj.ethereumSigner = message.ethereumSigner);
    message.signature !== undefined
      && (obj.signature = base64FromBytes(message.signature !== undefined ? message.signature : new Uint8Array()));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<SignerSetTxConfirmation>, I>>(object: I): SignerSetTxConfirmation {
    const message = createBaseSignerSetTxConfirmation();
    message.signerSetNonce = object.signerSetNonce ?? 0;
    message.ethereumSigner = object.ethereumSigner ?? "";
    message.signature = object.signature ?? new Uint8Array();
    return message;
  },
};

function createBaseMsgSubmitEthereumTxConfirmationResponse(): MsgSubmitEthereumTxConfirmationResponse {
  return {};
}

export const MsgSubmitEthereumTxConfirmationResponse = {
  encode(_: MsgSubmitEthereumTxConfirmationResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgSubmitEthereumTxConfirmationResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgSubmitEthereumTxConfirmationResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): MsgSubmitEthereumTxConfirmationResponse {
    return {};
  },

  toJSON(_: MsgSubmitEthereumTxConfirmationResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MsgSubmitEthereumTxConfirmationResponse>, I>>(
    _: I,
  ): MsgSubmitEthereumTxConfirmationResponse {
    const message = createBaseMsgSubmitEthereumTxConfirmationResponse();
    return message;
  },
};

function createBaseMsgSubmitEthereumEvent(): MsgSubmitEthereumEvent {
  return { event: undefined, signer: "" };
}

export const MsgSubmitEthereumEvent = {
  encode(message: MsgSubmitEthereumEvent, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.event !== undefined) {
      Any.encode(message.event, writer.uint32(10).fork()).ldelim();
    }
    if (message.signer !== "") {
      writer.uint32(18).string(message.signer);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgSubmitEthereumEvent {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgSubmitEthereumEvent();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.event = Any.decode(reader, reader.uint32());
          break;
        case 2:
          message.signer = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgSubmitEthereumEvent {
    return {
      event: isSet(object.event) ? Any.fromJSON(object.event) : undefined,
      signer: isSet(object.signer) ? String(object.signer) : "",
    };
  },

  toJSON(message: MsgSubmitEthereumEvent): unknown {
    const obj: any = {};
    message.event !== undefined && (obj.event = message.event ? Any.toJSON(message.event) : undefined);
    message.signer !== undefined && (obj.signer = message.signer);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MsgSubmitEthereumEvent>, I>>(object: I): MsgSubmitEthereumEvent {
    const message = createBaseMsgSubmitEthereumEvent();
    message.event = (object.event !== undefined && object.event !== null) ? Any.fromPartial(object.event) : undefined;
    message.signer = object.signer ?? "";
    return message;
  },
};

function createBaseMsgSubmitEthereumEventResponse(): MsgSubmitEthereumEventResponse {
  return {};
}

export const MsgSubmitEthereumEventResponse = {
  encode(_: MsgSubmitEthereumEventResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgSubmitEthereumEventResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgSubmitEthereumEventResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): MsgSubmitEthereumEventResponse {
    return {};
  },

  toJSON(_: MsgSubmitEthereumEventResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MsgSubmitEthereumEventResponse>, I>>(_: I): MsgSubmitEthereumEventResponse {
    const message = createBaseMsgSubmitEthereumEventResponse();
    return message;
  },
};

function createBaseMsgDelegateKeys(): MsgDelegateKeys {
  return { validatorAddress: "", orchestratorAddress: "", ethereumAddress: "", ethSignature: new Uint8Array() };
}

export const MsgDelegateKeys = {
  encode(message: MsgDelegateKeys, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.validatorAddress !== "") {
      writer.uint32(10).string(message.validatorAddress);
    }
    if (message.orchestratorAddress !== "") {
      writer.uint32(18).string(message.orchestratorAddress);
    }
    if (message.ethereumAddress !== "") {
      writer.uint32(26).string(message.ethereumAddress);
    }
    if (message.ethSignature.length !== 0) {
      writer.uint32(34).bytes(message.ethSignature);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgDelegateKeys {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgDelegateKeys();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.validatorAddress = reader.string();
          break;
        case 2:
          message.orchestratorAddress = reader.string();
          break;
        case 3:
          message.ethereumAddress = reader.string();
          break;
        case 4:
          message.ethSignature = reader.bytes();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgDelegateKeys {
    return {
      validatorAddress: isSet(object.validatorAddress) ? String(object.validatorAddress) : "",
      orchestratorAddress: isSet(object.orchestratorAddress) ? String(object.orchestratorAddress) : "",
      ethereumAddress: isSet(object.ethereumAddress) ? String(object.ethereumAddress) : "",
      ethSignature: isSet(object.ethSignature) ? bytesFromBase64(object.ethSignature) : new Uint8Array(),
    };
  },

  toJSON(message: MsgDelegateKeys): unknown {
    const obj: any = {};
    message.validatorAddress !== undefined && (obj.validatorAddress = message.validatorAddress);
    message.orchestratorAddress !== undefined && (obj.orchestratorAddress = message.orchestratorAddress);
    message.ethereumAddress !== undefined && (obj.ethereumAddress = message.ethereumAddress);
    message.ethSignature !== undefined
      && (obj.ethSignature = base64FromBytes(
        message.ethSignature !== undefined ? message.ethSignature : new Uint8Array(),
      ));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MsgDelegateKeys>, I>>(object: I): MsgDelegateKeys {
    const message = createBaseMsgDelegateKeys();
    message.validatorAddress = object.validatorAddress ?? "";
    message.orchestratorAddress = object.orchestratorAddress ?? "";
    message.ethereumAddress = object.ethereumAddress ?? "";
    message.ethSignature = object.ethSignature ?? new Uint8Array();
    return message;
  },
};

function createBaseMsgDelegateKeysResponse(): MsgDelegateKeysResponse {
  return {};
}

export const MsgDelegateKeysResponse = {
  encode(_: MsgDelegateKeysResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgDelegateKeysResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgDelegateKeysResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): MsgDelegateKeysResponse {
    return {};
  },

  toJSON(_: MsgDelegateKeysResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MsgDelegateKeysResponse>, I>>(_: I): MsgDelegateKeysResponse {
    const message = createBaseMsgDelegateKeysResponse();
    return message;
  },
};

function createBaseDelegateKeysSignMsg(): DelegateKeysSignMsg {
  return { validatorAddress: "", nonce: 0 };
}

export const DelegateKeysSignMsg = {
  encode(message: DelegateKeysSignMsg, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.validatorAddress !== "") {
      writer.uint32(10).string(message.validatorAddress);
    }
    if (message.nonce !== 0) {
      writer.uint32(16).uint64(message.nonce);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DelegateKeysSignMsg {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDelegateKeysSignMsg();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.validatorAddress = reader.string();
          break;
        case 2:
          message.nonce = longToNumber(reader.uint64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): DelegateKeysSignMsg {
    return {
      validatorAddress: isSet(object.validatorAddress) ? String(object.validatorAddress) : "",
      nonce: isSet(object.nonce) ? Number(object.nonce) : 0,
    };
  },

  toJSON(message: DelegateKeysSignMsg): unknown {
    const obj: any = {};
    message.validatorAddress !== undefined && (obj.validatorAddress = message.validatorAddress);
    message.nonce !== undefined && (obj.nonce = Math.round(message.nonce));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<DelegateKeysSignMsg>, I>>(object: I): DelegateKeysSignMsg {
    const message = createBaseDelegateKeysSignMsg();
    message.validatorAddress = object.validatorAddress ?? "";
    message.nonce = object.nonce ?? 0;
    return message;
  },
};

function createBaseMsgEthereumHeightVote(): MsgEthereumHeightVote {
  return { ethereumHeight: 0, signer: "" };
}

export const MsgEthereumHeightVote = {
  encode(message: MsgEthereumHeightVote, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.ethereumHeight !== 0) {
      writer.uint32(8).uint64(message.ethereumHeight);
    }
    if (message.signer !== "") {
      writer.uint32(18).string(message.signer);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgEthereumHeightVote {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgEthereumHeightVote();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.ethereumHeight = longToNumber(reader.uint64() as Long);
          break;
        case 2:
          message.signer = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgEthereumHeightVote {
    return {
      ethereumHeight: isSet(object.ethereumHeight) ? Number(object.ethereumHeight) : 0,
      signer: isSet(object.signer) ? String(object.signer) : "",
    };
  },

  toJSON(message: MsgEthereumHeightVote): unknown {
    const obj: any = {};
    message.ethereumHeight !== undefined && (obj.ethereumHeight = Math.round(message.ethereumHeight));
    message.signer !== undefined && (obj.signer = message.signer);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MsgEthereumHeightVote>, I>>(object: I): MsgEthereumHeightVote {
    const message = createBaseMsgEthereumHeightVote();
    message.ethereumHeight = object.ethereumHeight ?? 0;
    message.signer = object.signer ?? "";
    return message;
  },
};

function createBaseMsgEthereumHeightVoteResponse(): MsgEthereumHeightVoteResponse {
  return {};
}

export const MsgEthereumHeightVoteResponse = {
  encode(_: MsgEthereumHeightVoteResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgEthereumHeightVoteResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgEthereumHeightVoteResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): MsgEthereumHeightVoteResponse {
    return {};
  },

  toJSON(_: MsgEthereumHeightVoteResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MsgEthereumHeightVoteResponse>, I>>(_: I): MsgEthereumHeightVoteResponse {
    const message = createBaseMsgEthereumHeightVoteResponse();
    return message;
  },
};

function createBaseSendToCosmosEvent(): SendToCosmosEvent {
  return { eventNonce: 0, tokenContract: "", amount: "", ethereumSender: "", cosmosReceiver: "", ethereumHeight: 0 };
}

export const SendToCosmosEvent = {
  encode(message: SendToCosmosEvent, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.eventNonce !== 0) {
      writer.uint32(8).uint64(message.eventNonce);
    }
    if (message.tokenContract !== "") {
      writer.uint32(18).string(message.tokenContract);
    }
    if (message.amount !== "") {
      writer.uint32(26).string(message.amount);
    }
    if (message.ethereumSender !== "") {
      writer.uint32(34).string(message.ethereumSender);
    }
    if (message.cosmosReceiver !== "") {
      writer.uint32(42).string(message.cosmosReceiver);
    }
    if (message.ethereumHeight !== 0) {
      writer.uint32(48).uint64(message.ethereumHeight);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SendToCosmosEvent {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSendToCosmosEvent();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.eventNonce = longToNumber(reader.uint64() as Long);
          break;
        case 2:
          message.tokenContract = reader.string();
          break;
        case 3:
          message.amount = reader.string();
          break;
        case 4:
          message.ethereumSender = reader.string();
          break;
        case 5:
          message.cosmosReceiver = reader.string();
          break;
        case 6:
          message.ethereumHeight = longToNumber(reader.uint64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): SendToCosmosEvent {
    return {
      eventNonce: isSet(object.eventNonce) ? Number(object.eventNonce) : 0,
      tokenContract: isSet(object.tokenContract) ? String(object.tokenContract) : "",
      amount: isSet(object.amount) ? String(object.amount) : "",
      ethereumSender: isSet(object.ethereumSender) ? String(object.ethereumSender) : "",
      cosmosReceiver: isSet(object.cosmosReceiver) ? String(object.cosmosReceiver) : "",
      ethereumHeight: isSet(object.ethereumHeight) ? Number(object.ethereumHeight) : 0,
    };
  },

  toJSON(message: SendToCosmosEvent): unknown {
    const obj: any = {};
    message.eventNonce !== undefined && (obj.eventNonce = Math.round(message.eventNonce));
    message.tokenContract !== undefined && (obj.tokenContract = message.tokenContract);
    message.amount !== undefined && (obj.amount = message.amount);
    message.ethereumSender !== undefined && (obj.ethereumSender = message.ethereumSender);
    message.cosmosReceiver !== undefined && (obj.cosmosReceiver = message.cosmosReceiver);
    message.ethereumHeight !== undefined && (obj.ethereumHeight = Math.round(message.ethereumHeight));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<SendToCosmosEvent>, I>>(object: I): SendToCosmosEvent {
    const message = createBaseSendToCosmosEvent();
    message.eventNonce = object.eventNonce ?? 0;
    message.tokenContract = object.tokenContract ?? "";
    message.amount = object.amount ?? "";
    message.ethereumSender = object.ethereumSender ?? "";
    message.cosmosReceiver = object.cosmosReceiver ?? "";
    message.ethereumHeight = object.ethereumHeight ?? 0;
    return message;
  },
};

function createBaseBatchExecutedEvent(): BatchExecutedEvent {
  return { tokenContract: "", eventNonce: 0, ethereumHeight: 0, batchNonce: 0 };
}

export const BatchExecutedEvent = {
  encode(message: BatchExecutedEvent, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.tokenContract !== "") {
      writer.uint32(10).string(message.tokenContract);
    }
    if (message.eventNonce !== 0) {
      writer.uint32(16).uint64(message.eventNonce);
    }
    if (message.ethereumHeight !== 0) {
      writer.uint32(24).uint64(message.ethereumHeight);
    }
    if (message.batchNonce !== 0) {
      writer.uint32(32).uint64(message.batchNonce);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): BatchExecutedEvent {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBatchExecutedEvent();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.tokenContract = reader.string();
          break;
        case 2:
          message.eventNonce = longToNumber(reader.uint64() as Long);
          break;
        case 3:
          message.ethereumHeight = longToNumber(reader.uint64() as Long);
          break;
        case 4:
          message.batchNonce = longToNumber(reader.uint64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): BatchExecutedEvent {
    return {
      tokenContract: isSet(object.tokenContract) ? String(object.tokenContract) : "",
      eventNonce: isSet(object.eventNonce) ? Number(object.eventNonce) : 0,
      ethereumHeight: isSet(object.ethereumHeight) ? Number(object.ethereumHeight) : 0,
      batchNonce: isSet(object.batchNonce) ? Number(object.batchNonce) : 0,
    };
  },

  toJSON(message: BatchExecutedEvent): unknown {
    const obj: any = {};
    message.tokenContract !== undefined && (obj.tokenContract = message.tokenContract);
    message.eventNonce !== undefined && (obj.eventNonce = Math.round(message.eventNonce));
    message.ethereumHeight !== undefined && (obj.ethereumHeight = Math.round(message.ethereumHeight));
    message.batchNonce !== undefined && (obj.batchNonce = Math.round(message.batchNonce));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<BatchExecutedEvent>, I>>(object: I): BatchExecutedEvent {
    const message = createBaseBatchExecutedEvent();
    message.tokenContract = object.tokenContract ?? "";
    message.eventNonce = object.eventNonce ?? 0;
    message.ethereumHeight = object.ethereumHeight ?? 0;
    message.batchNonce = object.batchNonce ?? 0;
    return message;
  },
};

function createBaseContractCallExecutedEvent(): ContractCallExecutedEvent {
  return { eventNonce: 0, invalidationScope: new Uint8Array(), invalidationNonce: 0, ethereumHeight: 0 };
}

export const ContractCallExecutedEvent = {
  encode(message: ContractCallExecutedEvent, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.eventNonce !== 0) {
      writer.uint32(8).uint64(message.eventNonce);
    }
    if (message.invalidationScope.length !== 0) {
      writer.uint32(18).bytes(message.invalidationScope);
    }
    if (message.invalidationNonce !== 0) {
      writer.uint32(24).uint64(message.invalidationNonce);
    }
    if (message.ethereumHeight !== 0) {
      writer.uint32(32).uint64(message.ethereumHeight);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ContractCallExecutedEvent {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseContractCallExecutedEvent();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.eventNonce = longToNumber(reader.uint64() as Long);
          break;
        case 2:
          message.invalidationScope = reader.bytes();
          break;
        case 3:
          message.invalidationNonce = longToNumber(reader.uint64() as Long);
          break;
        case 4:
          message.ethereumHeight = longToNumber(reader.uint64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ContractCallExecutedEvent {
    return {
      eventNonce: isSet(object.eventNonce) ? Number(object.eventNonce) : 0,
      invalidationScope: isSet(object.invalidationScope) ? bytesFromBase64(object.invalidationScope) : new Uint8Array(),
      invalidationNonce: isSet(object.invalidationNonce) ? Number(object.invalidationNonce) : 0,
      ethereumHeight: isSet(object.ethereumHeight) ? Number(object.ethereumHeight) : 0,
    };
  },

  toJSON(message: ContractCallExecutedEvent): unknown {
    const obj: any = {};
    message.eventNonce !== undefined && (obj.eventNonce = Math.round(message.eventNonce));
    message.invalidationScope !== undefined
      && (obj.invalidationScope = base64FromBytes(
        message.invalidationScope !== undefined ? message.invalidationScope : new Uint8Array(),
      ));
    message.invalidationNonce !== undefined && (obj.invalidationNonce = Math.round(message.invalidationNonce));
    message.ethereumHeight !== undefined && (obj.ethereumHeight = Math.round(message.ethereumHeight));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<ContractCallExecutedEvent>, I>>(object: I): ContractCallExecutedEvent {
    const message = createBaseContractCallExecutedEvent();
    message.eventNonce = object.eventNonce ?? 0;
    message.invalidationScope = object.invalidationScope ?? new Uint8Array();
    message.invalidationNonce = object.invalidationNonce ?? 0;
    message.ethereumHeight = object.ethereumHeight ?? 0;
    return message;
  },
};

function createBaseERC20DeployedEvent(): ERC20DeployedEvent {
  return {
    eventNonce: 0,
    cosmosDenom: "",
    tokenContract: "",
    erc20Name: "",
    erc20Symbol: "",
    erc20Decimals: 0,
    ethereumHeight: 0,
  };
}

export const ERC20DeployedEvent = {
  encode(message: ERC20DeployedEvent, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.eventNonce !== 0) {
      writer.uint32(8).uint64(message.eventNonce);
    }
    if (message.cosmosDenom !== "") {
      writer.uint32(18).string(message.cosmosDenom);
    }
    if (message.tokenContract !== "") {
      writer.uint32(26).string(message.tokenContract);
    }
    if (message.erc20Name !== "") {
      writer.uint32(34).string(message.erc20Name);
    }
    if (message.erc20Symbol !== "") {
      writer.uint32(42).string(message.erc20Symbol);
    }
    if (message.erc20Decimals !== 0) {
      writer.uint32(48).uint64(message.erc20Decimals);
    }
    if (message.ethereumHeight !== 0) {
      writer.uint32(56).uint64(message.ethereumHeight);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ERC20DeployedEvent {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseERC20DeployedEvent();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.eventNonce = longToNumber(reader.uint64() as Long);
          break;
        case 2:
          message.cosmosDenom = reader.string();
          break;
        case 3:
          message.tokenContract = reader.string();
          break;
        case 4:
          message.erc20Name = reader.string();
          break;
        case 5:
          message.erc20Symbol = reader.string();
          break;
        case 6:
          message.erc20Decimals = longToNumber(reader.uint64() as Long);
          break;
        case 7:
          message.ethereumHeight = longToNumber(reader.uint64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ERC20DeployedEvent {
    return {
      eventNonce: isSet(object.eventNonce) ? Number(object.eventNonce) : 0,
      cosmosDenom: isSet(object.cosmosDenom) ? String(object.cosmosDenom) : "",
      tokenContract: isSet(object.tokenContract) ? String(object.tokenContract) : "",
      erc20Name: isSet(object.erc20Name) ? String(object.erc20Name) : "",
      erc20Symbol: isSet(object.erc20Symbol) ? String(object.erc20Symbol) : "",
      erc20Decimals: isSet(object.erc20Decimals) ? Number(object.erc20Decimals) : 0,
      ethereumHeight: isSet(object.ethereumHeight) ? Number(object.ethereumHeight) : 0,
    };
  },

  toJSON(message: ERC20DeployedEvent): unknown {
    const obj: any = {};
    message.eventNonce !== undefined && (obj.eventNonce = Math.round(message.eventNonce));
    message.cosmosDenom !== undefined && (obj.cosmosDenom = message.cosmosDenom);
    message.tokenContract !== undefined && (obj.tokenContract = message.tokenContract);
    message.erc20Name !== undefined && (obj.erc20Name = message.erc20Name);
    message.erc20Symbol !== undefined && (obj.erc20Symbol = message.erc20Symbol);
    message.erc20Decimals !== undefined && (obj.erc20Decimals = Math.round(message.erc20Decimals));
    message.ethereumHeight !== undefined && (obj.ethereumHeight = Math.round(message.ethereumHeight));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<ERC20DeployedEvent>, I>>(object: I): ERC20DeployedEvent {
    const message = createBaseERC20DeployedEvent();
    message.eventNonce = object.eventNonce ?? 0;
    message.cosmosDenom = object.cosmosDenom ?? "";
    message.tokenContract = object.tokenContract ?? "";
    message.erc20Name = object.erc20Name ?? "";
    message.erc20Symbol = object.erc20Symbol ?? "";
    message.erc20Decimals = object.erc20Decimals ?? 0;
    message.ethereumHeight = object.ethereumHeight ?? 0;
    return message;
  },
};

function createBaseSignerSetTxExecutedEvent(): SignerSetTxExecutedEvent {
  return { eventNonce: 0, signerSetTxNonce: 0, ethereumHeight: 0, members: [] };
}

export const SignerSetTxExecutedEvent = {
  encode(message: SignerSetTxExecutedEvent, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.eventNonce !== 0) {
      writer.uint32(8).uint64(message.eventNonce);
    }
    if (message.signerSetTxNonce !== 0) {
      writer.uint32(16).uint64(message.signerSetTxNonce);
    }
    if (message.ethereumHeight !== 0) {
      writer.uint32(24).uint64(message.ethereumHeight);
    }
    for (const v of message.members) {
      EthereumSigner.encode(v!, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SignerSetTxExecutedEvent {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSignerSetTxExecutedEvent();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.eventNonce = longToNumber(reader.uint64() as Long);
          break;
        case 2:
          message.signerSetTxNonce = longToNumber(reader.uint64() as Long);
          break;
        case 3:
          message.ethereumHeight = longToNumber(reader.uint64() as Long);
          break;
        case 4:
          message.members.push(EthereumSigner.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): SignerSetTxExecutedEvent {
    return {
      eventNonce: isSet(object.eventNonce) ? Number(object.eventNonce) : 0,
      signerSetTxNonce: isSet(object.signerSetTxNonce) ? Number(object.signerSetTxNonce) : 0,
      ethereumHeight: isSet(object.ethereumHeight) ? Number(object.ethereumHeight) : 0,
      members: Array.isArray(object?.members) ? object.members.map((e: any) => EthereumSigner.fromJSON(e)) : [],
    };
  },

  toJSON(message: SignerSetTxExecutedEvent): unknown {
    const obj: any = {};
    message.eventNonce !== undefined && (obj.eventNonce = Math.round(message.eventNonce));
    message.signerSetTxNonce !== undefined && (obj.signerSetTxNonce = Math.round(message.signerSetTxNonce));
    message.ethereumHeight !== undefined && (obj.ethereumHeight = Math.round(message.ethereumHeight));
    if (message.members) {
      obj.members = message.members.map((e) => e ? EthereumSigner.toJSON(e) : undefined);
    } else {
      obj.members = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<SignerSetTxExecutedEvent>, I>>(object: I): SignerSetTxExecutedEvent {
    const message = createBaseSignerSetTxExecutedEvent();
    message.eventNonce = object.eventNonce ?? 0;
    message.signerSetTxNonce = object.signerSetTxNonce ?? 0;
    message.ethereumHeight = object.ethereumHeight ?? 0;
    message.members = object.members?.map((e) => EthereumSigner.fromPartial(e)) || [];
    return message;
  },
};

/** Msg defines the state transitions possible within gravity */
export interface Msg {
  /** option (google.api.http).post = "/gravity/v1/send_to_ethereum"; */
  SendToEthereum(request: MsgSendToEthereum): Promise<MsgSendToEthereumResponse>;
  /** option (google.api.http).post = "/gravity/v1/send_to_ethereum/cancel"; */
  CancelSendToEthereum(request: MsgCancelSendToEthereum): Promise<MsgCancelSendToEthereumResponse>;
  /** option (google.api.http).post = "/gravity/v1/batchtx/request"; */
  RequestBatchTx(request: MsgRequestBatchTx): Promise<MsgRequestBatchTxResponse>;
  /** option (google.api.http).post = "/gravity/v1/ethereum_signature"; */
  SubmitEthereumTxConfirmation(
    request: MsgSubmitEthereumTxConfirmation,
  ): Promise<MsgSubmitEthereumTxConfirmationResponse>;
  /** option (google.api.http).post = "/gravity/v1/ethereum_event"; */
  SubmitEthereumEvent(request: MsgSubmitEthereumEvent): Promise<MsgSubmitEthereumEventResponse>;
  /** option (google.api.http).post = "/gravity/v1/delegate_keys"; */
  SetDelegateKeys(request: MsgDelegateKeys): Promise<MsgDelegateKeysResponse>;
  /** option (google.api.http).post = "/gravity/v1/ethereum_height_vote"; */
  SubmitEthereumHeightVote(request: MsgEthereumHeightVote): Promise<MsgEthereumHeightVoteResponse>;
}

export class MsgClientImpl implements Msg {
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.SendToEthereum = this.SendToEthereum.bind(this);
    this.CancelSendToEthereum = this.CancelSendToEthereum.bind(this);
    this.RequestBatchTx = this.RequestBatchTx.bind(this);
    this.SubmitEthereumTxConfirmation = this.SubmitEthereumTxConfirmation.bind(this);
    this.SubmitEthereumEvent = this.SubmitEthereumEvent.bind(this);
    this.SetDelegateKeys = this.SetDelegateKeys.bind(this);
    this.SubmitEthereumHeightVote = this.SubmitEthereumHeightVote.bind(this);
  }
  SendToEthereum(request: MsgSendToEthereum): Promise<MsgSendToEthereumResponse> {
    const data = MsgSendToEthereum.encode(request).finish();
    const promise = this.rpc.request("gravity.v1.Msg", "SendToEthereum", data);
    return promise.then((data) => MsgSendToEthereumResponse.decode(new _m0.Reader(data)));
  }

  CancelSendToEthereum(request: MsgCancelSendToEthereum): Promise<MsgCancelSendToEthereumResponse> {
    const data = MsgCancelSendToEthereum.encode(request).finish();
    const promise = this.rpc.request("gravity.v1.Msg", "CancelSendToEthereum", data);
    return promise.then((data) => MsgCancelSendToEthereumResponse.decode(new _m0.Reader(data)));
  }

  RequestBatchTx(request: MsgRequestBatchTx): Promise<MsgRequestBatchTxResponse> {
    const data = MsgRequestBatchTx.encode(request).finish();
    const promise = this.rpc.request("gravity.v1.Msg", "RequestBatchTx", data);
    return promise.then((data) => MsgRequestBatchTxResponse.decode(new _m0.Reader(data)));
  }

  SubmitEthereumTxConfirmation(
    request: MsgSubmitEthereumTxConfirmation,
  ): Promise<MsgSubmitEthereumTxConfirmationResponse> {
    const data = MsgSubmitEthereumTxConfirmation.encode(request).finish();
    const promise = this.rpc.request("gravity.v1.Msg", "SubmitEthereumTxConfirmation", data);
    return promise.then((data) => MsgSubmitEthereumTxConfirmationResponse.decode(new _m0.Reader(data)));
  }

  SubmitEthereumEvent(request: MsgSubmitEthereumEvent): Promise<MsgSubmitEthereumEventResponse> {
    const data = MsgSubmitEthereumEvent.encode(request).finish();
    const promise = this.rpc.request("gravity.v1.Msg", "SubmitEthereumEvent", data);
    return promise.then((data) => MsgSubmitEthereumEventResponse.decode(new _m0.Reader(data)));
  }

  SetDelegateKeys(request: MsgDelegateKeys): Promise<MsgDelegateKeysResponse> {
    const data = MsgDelegateKeys.encode(request).finish();
    const promise = this.rpc.request("gravity.v1.Msg", "SetDelegateKeys", data);
    return promise.then((data) => MsgDelegateKeysResponse.decode(new _m0.Reader(data)));
  }

  SubmitEthereumHeightVote(request: MsgEthereumHeightVote): Promise<MsgEthereumHeightVoteResponse> {
    const data = MsgEthereumHeightVote.encode(request).finish();
    const promise = this.rpc.request("gravity.v1.Msg", "SubmitEthereumHeightVote", data);
    return promise.then((data) => MsgEthereumHeightVoteResponse.decode(new _m0.Reader(data)));
  }
}

interface Rpc {
  request(service: string, method: string, data: Uint8Array): Promise<Uint8Array>;
}

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
