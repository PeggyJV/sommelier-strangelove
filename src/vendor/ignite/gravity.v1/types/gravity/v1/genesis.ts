/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";
import { Any } from "../../google/protobuf/any";
import { EthereumEventVoteRecord, SendToEthereum } from "./gravity";
import { MsgDelegateKeys } from "./msgs";

export const protobufPackage = "gravity.v1";

/**
 * Params represent the Gravity genesis and store parameters
 * gravity_id:
 * a random 32 byte value to prevent signature reuse, for example if the
 * cosmos validators decided to use the same Ethereum keys for another chain
 * also running Gravity we would not want it to be possible to play a deposit
 * from chain A back on chain B's Gravity. This value IS USED ON ETHEREUM so
 * it must be set in your genesis.json before launch and not changed after
 * deploying Gravity
 *
 * contract_hash:
 * the code hash of a known good version of the Gravity contract
 * solidity code. This can be used to verify the correct version
 * of the contract has been deployed. This is a reference value for
 * goernance action only it is never read by any Gravity code
 *
 * bridge_ethereum_address:
 * is address of the bridge contract on the Ethereum side, this is a
 * reference value for governance only and is not actually used by any
 * Gravity code
 *
 * bridge_chain_id:
 * the unique identifier of the Ethereum chain, this is a reference value
 * only and is not actually used by any Gravity code
 *
 * These reference values may be used by future Gravity client implemetnations
 * to allow for saftey features or convenience features like the Gravity address
 * in your relayer. A relayer would require a configured Gravity address if
 * governance had not set the address on the chain it was relaying for.
 *
 * signed_signer_set_txs_window
 * signed_batches_window
 * signed_ethereum_signatures_window
 *
 * These values represent the time in blocks that a validator has to submit
 * a signature for a batch or valset, or to submit a ethereum_signature for a
 * particular attestation nonce. In the case of attestations this clock starts
 * when the attestation is created, but only allows for slashing once the event
 * has passed
 *
 * target_eth_tx_timeout:
 *
 * This is the 'target' value for when ethereum transactions time out, this is a
 * target because Ethereum is a probabilistic chain and you can't say for sure
 * what the block frequency is ahead of time.
 *
 * average_block_time
 * average_ethereum_block_time
 *
 * These values are the average Cosmos block time and Ethereum block time
 * respectively and they are used to compute what the target batch timeout is.
 * It is important that governance updates these in case of any major, prolonged
 * change in the time it takes to produce a block
 *
 * slash_fraction_signer_set_tx
 * slash_fraction_batch
 * slash_fraction_ethereum_signature
 * slash_fraction_conflicting_ethereum_signature
 *
 * The slashing fractions for the various gravity related slashing conditions.
 * The first three refer to not submitting a particular message, the third for
 * submitting a different ethereum_signature for the same Ethereum event
 */
export interface Params {
  gravityId: string;
  contractSourceHash: string;
  bridgeEthereumAddress: string;
  bridgeChainId: number;
  signedSignerSetTxsWindow: number;
  signedBatchesWindow: number;
  ethereumSignaturesWindow: number;
  targetEthTxTimeout: number;
  averageBlockTime: number;
  averageEthereumBlockTime: number;
  /** TODO: slash fraction for contract call txs too */
  slashFractionSignerSetTx: Uint8Array;
  slashFractionBatch: Uint8Array;
  slashFractionEthereumSignature: Uint8Array;
  slashFractionConflictingEthereumSignature: Uint8Array;
  unbondSlashingSignerSetTxsWindow: number;
}

/**
 * GenesisState struct
 * TODO: this need to be audited and potentially simplified using the new
 * interfaces
 */
export interface GenesisState {
  params: Params | undefined;
  lastObservedEventNonce: number;
  outgoingTxs: Any[];
  confirmations: Any[];
  ethereumEventVoteRecords: EthereumEventVoteRecord[];
  delegateKeys: MsgDelegateKeys[];
  erc20ToDenoms: ERC20ToDenom[];
  unbatchedSendToEthereumTxs: SendToEthereum[];
}

/**
 * This records the relationship between an ERC20 token and the denom
 * of the corresponding Cosmos originated asset
 */
export interface ERC20ToDenom {
  erc20: string;
  denom: string;
}

function createBaseParams(): Params {
  return {
    gravityId: "",
    contractSourceHash: "",
    bridgeEthereumAddress: "",
    bridgeChainId: 0,
    signedSignerSetTxsWindow: 0,
    signedBatchesWindow: 0,
    ethereumSignaturesWindow: 0,
    targetEthTxTimeout: 0,
    averageBlockTime: 0,
    averageEthereumBlockTime: 0,
    slashFractionSignerSetTx: new Uint8Array(),
    slashFractionBatch: new Uint8Array(),
    slashFractionEthereumSignature: new Uint8Array(),
    slashFractionConflictingEthereumSignature: new Uint8Array(),
    unbondSlashingSignerSetTxsWindow: 0,
  };
}

export const Params = {
  encode(message: Params, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.gravityId !== "") {
      writer.uint32(10).string(message.gravityId);
    }
    if (message.contractSourceHash !== "") {
      writer.uint32(18).string(message.contractSourceHash);
    }
    if (message.bridgeEthereumAddress !== "") {
      writer.uint32(34).string(message.bridgeEthereumAddress);
    }
    if (message.bridgeChainId !== 0) {
      writer.uint32(40).uint64(message.bridgeChainId);
    }
    if (message.signedSignerSetTxsWindow !== 0) {
      writer.uint32(48).uint64(message.signedSignerSetTxsWindow);
    }
    if (message.signedBatchesWindow !== 0) {
      writer.uint32(56).uint64(message.signedBatchesWindow);
    }
    if (message.ethereumSignaturesWindow !== 0) {
      writer.uint32(64).uint64(message.ethereumSignaturesWindow);
    }
    if (message.targetEthTxTimeout !== 0) {
      writer.uint32(80).uint64(message.targetEthTxTimeout);
    }
    if (message.averageBlockTime !== 0) {
      writer.uint32(88).uint64(message.averageBlockTime);
    }
    if (message.averageEthereumBlockTime !== 0) {
      writer.uint32(96).uint64(message.averageEthereumBlockTime);
    }
    if (message.slashFractionSignerSetTx.length !== 0) {
      writer.uint32(106).bytes(message.slashFractionSignerSetTx);
    }
    if (message.slashFractionBatch.length !== 0) {
      writer.uint32(114).bytes(message.slashFractionBatch);
    }
    if (message.slashFractionEthereumSignature.length !== 0) {
      writer.uint32(122).bytes(message.slashFractionEthereumSignature);
    }
    if (message.slashFractionConflictingEthereumSignature.length !== 0) {
      writer.uint32(130).bytes(message.slashFractionConflictingEthereumSignature);
    }
    if (message.unbondSlashingSignerSetTxsWindow !== 0) {
      writer.uint32(136).uint64(message.unbondSlashingSignerSetTxsWindow);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Params {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseParams();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.gravityId = reader.string();
          break;
        case 2:
          message.contractSourceHash = reader.string();
          break;
        case 4:
          message.bridgeEthereumAddress = reader.string();
          break;
        case 5:
          message.bridgeChainId = longToNumber(reader.uint64() as Long);
          break;
        case 6:
          message.signedSignerSetTxsWindow = longToNumber(reader.uint64() as Long);
          break;
        case 7:
          message.signedBatchesWindow = longToNumber(reader.uint64() as Long);
          break;
        case 8:
          message.ethereumSignaturesWindow = longToNumber(reader.uint64() as Long);
          break;
        case 10:
          message.targetEthTxTimeout = longToNumber(reader.uint64() as Long);
          break;
        case 11:
          message.averageBlockTime = longToNumber(reader.uint64() as Long);
          break;
        case 12:
          message.averageEthereumBlockTime = longToNumber(reader.uint64() as Long);
          break;
        case 13:
          message.slashFractionSignerSetTx = reader.bytes();
          break;
        case 14:
          message.slashFractionBatch = reader.bytes();
          break;
        case 15:
          message.slashFractionEthereumSignature = reader.bytes();
          break;
        case 16:
          message.slashFractionConflictingEthereumSignature = reader.bytes();
          break;
        case 17:
          message.unbondSlashingSignerSetTxsWindow = longToNumber(reader.uint64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Params {
    return {
      gravityId: isSet(object.gravityId) ? String(object.gravityId) : "",
      contractSourceHash: isSet(object.contractSourceHash) ? String(object.contractSourceHash) : "",
      bridgeEthereumAddress: isSet(object.bridgeEthereumAddress) ? String(object.bridgeEthereumAddress) : "",
      bridgeChainId: isSet(object.bridgeChainId) ? Number(object.bridgeChainId) : 0,
      signedSignerSetTxsWindow: isSet(object.signedSignerSetTxsWindow) ? Number(object.signedSignerSetTxsWindow) : 0,
      signedBatchesWindow: isSet(object.signedBatchesWindow) ? Number(object.signedBatchesWindow) : 0,
      ethereumSignaturesWindow: isSet(object.ethereumSignaturesWindow) ? Number(object.ethereumSignaturesWindow) : 0,
      targetEthTxTimeout: isSet(object.targetEthTxTimeout) ? Number(object.targetEthTxTimeout) : 0,
      averageBlockTime: isSet(object.averageBlockTime) ? Number(object.averageBlockTime) : 0,
      averageEthereumBlockTime: isSet(object.averageEthereumBlockTime) ? Number(object.averageEthereumBlockTime) : 0,
      slashFractionSignerSetTx: isSet(object.slashFractionSignerSetTx)
        ? bytesFromBase64(object.slashFractionSignerSetTx)
        : new Uint8Array(),
      slashFractionBatch: isSet(object.slashFractionBatch)
        ? bytesFromBase64(object.slashFractionBatch)
        : new Uint8Array(),
      slashFractionEthereumSignature: isSet(object.slashFractionEthereumSignature)
        ? bytesFromBase64(object.slashFractionEthereumSignature)
        : new Uint8Array(),
      slashFractionConflictingEthereumSignature: isSet(object.slashFractionConflictingEthereumSignature)
        ? bytesFromBase64(object.slashFractionConflictingEthereumSignature)
        : new Uint8Array(),
      unbondSlashingSignerSetTxsWindow: isSet(object.unbondSlashingSignerSetTxsWindow)
        ? Number(object.unbondSlashingSignerSetTxsWindow)
        : 0,
    };
  },

  toJSON(message: Params): unknown {
    const obj: any = {};
    message.gravityId !== undefined && (obj.gravityId = message.gravityId);
    message.contractSourceHash !== undefined && (obj.contractSourceHash = message.contractSourceHash);
    message.bridgeEthereumAddress !== undefined && (obj.bridgeEthereumAddress = message.bridgeEthereumAddress);
    message.bridgeChainId !== undefined && (obj.bridgeChainId = Math.round(message.bridgeChainId));
    message.signedSignerSetTxsWindow !== undefined
      && (obj.signedSignerSetTxsWindow = Math.round(message.signedSignerSetTxsWindow));
    message.signedBatchesWindow !== undefined && (obj.signedBatchesWindow = Math.round(message.signedBatchesWindow));
    message.ethereumSignaturesWindow !== undefined
      && (obj.ethereumSignaturesWindow = Math.round(message.ethereumSignaturesWindow));
    message.targetEthTxTimeout !== undefined && (obj.targetEthTxTimeout = Math.round(message.targetEthTxTimeout));
    message.averageBlockTime !== undefined && (obj.averageBlockTime = Math.round(message.averageBlockTime));
    message.averageEthereumBlockTime !== undefined
      && (obj.averageEthereumBlockTime = Math.round(message.averageEthereumBlockTime));
    message.slashFractionSignerSetTx !== undefined
      && (obj.slashFractionSignerSetTx = base64FromBytes(
        message.slashFractionSignerSetTx !== undefined ? message.slashFractionSignerSetTx : new Uint8Array(),
      ));
    message.slashFractionBatch !== undefined
      && (obj.slashFractionBatch = base64FromBytes(
        message.slashFractionBatch !== undefined ? message.slashFractionBatch : new Uint8Array(),
      ));
    message.slashFractionEthereumSignature !== undefined
      && (obj.slashFractionEthereumSignature = base64FromBytes(
        message.slashFractionEthereumSignature !== undefined
          ? message.slashFractionEthereumSignature
          : new Uint8Array(),
      ));
    message.slashFractionConflictingEthereumSignature !== undefined
      && (obj.slashFractionConflictingEthereumSignature = base64FromBytes(
        message.slashFractionConflictingEthereumSignature !== undefined
          ? message.slashFractionConflictingEthereumSignature
          : new Uint8Array(),
      ));
    message.unbondSlashingSignerSetTxsWindow !== undefined
      && (obj.unbondSlashingSignerSetTxsWindow = Math.round(message.unbondSlashingSignerSetTxsWindow));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Params>, I>>(object: I): Params {
    const message = createBaseParams();
    message.gravityId = object.gravityId ?? "";
    message.contractSourceHash = object.contractSourceHash ?? "";
    message.bridgeEthereumAddress = object.bridgeEthereumAddress ?? "";
    message.bridgeChainId = object.bridgeChainId ?? 0;
    message.signedSignerSetTxsWindow = object.signedSignerSetTxsWindow ?? 0;
    message.signedBatchesWindow = object.signedBatchesWindow ?? 0;
    message.ethereumSignaturesWindow = object.ethereumSignaturesWindow ?? 0;
    message.targetEthTxTimeout = object.targetEthTxTimeout ?? 0;
    message.averageBlockTime = object.averageBlockTime ?? 0;
    message.averageEthereumBlockTime = object.averageEthereumBlockTime ?? 0;
    message.slashFractionSignerSetTx = object.slashFractionSignerSetTx ?? new Uint8Array();
    message.slashFractionBatch = object.slashFractionBatch ?? new Uint8Array();
    message.slashFractionEthereumSignature = object.slashFractionEthereumSignature ?? new Uint8Array();
    message.slashFractionConflictingEthereumSignature = object.slashFractionConflictingEthereumSignature
      ?? new Uint8Array();
    message.unbondSlashingSignerSetTxsWindow = object.unbondSlashingSignerSetTxsWindow ?? 0;
    return message;
  },
};

function createBaseGenesisState(): GenesisState {
  return {
    params: undefined,
    lastObservedEventNonce: 0,
    outgoingTxs: [],
    confirmations: [],
    ethereumEventVoteRecords: [],
    delegateKeys: [],
    erc20ToDenoms: [],
    unbatchedSendToEthereumTxs: [],
  };
}

export const GenesisState = {
  encode(message: GenesisState, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.params !== undefined) {
      Params.encode(message.params, writer.uint32(10).fork()).ldelim();
    }
    if (message.lastObservedEventNonce !== 0) {
      writer.uint32(16).uint64(message.lastObservedEventNonce);
    }
    for (const v of message.outgoingTxs) {
      Any.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    for (const v of message.confirmations) {
      Any.encode(v!, writer.uint32(34).fork()).ldelim();
    }
    for (const v of message.ethereumEventVoteRecords) {
      EthereumEventVoteRecord.encode(v!, writer.uint32(74).fork()).ldelim();
    }
    for (const v of message.delegateKeys) {
      MsgDelegateKeys.encode(v!, writer.uint32(82).fork()).ldelim();
    }
    for (const v of message.erc20ToDenoms) {
      ERC20ToDenom.encode(v!, writer.uint32(90).fork()).ldelim();
    }
    for (const v of message.unbatchedSendToEthereumTxs) {
      SendToEthereum.encode(v!, writer.uint32(98).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GenesisState {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGenesisState();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.params = Params.decode(reader, reader.uint32());
          break;
        case 2:
          message.lastObservedEventNonce = longToNumber(reader.uint64() as Long);
          break;
        case 3:
          message.outgoingTxs.push(Any.decode(reader, reader.uint32()));
          break;
        case 4:
          message.confirmations.push(Any.decode(reader, reader.uint32()));
          break;
        case 9:
          message.ethereumEventVoteRecords.push(EthereumEventVoteRecord.decode(reader, reader.uint32()));
          break;
        case 10:
          message.delegateKeys.push(MsgDelegateKeys.decode(reader, reader.uint32()));
          break;
        case 11:
          message.erc20ToDenoms.push(ERC20ToDenom.decode(reader, reader.uint32()));
          break;
        case 12:
          message.unbatchedSendToEthereumTxs.push(SendToEthereum.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GenesisState {
    return {
      params: isSet(object.params) ? Params.fromJSON(object.params) : undefined,
      lastObservedEventNonce: isSet(object.lastObservedEventNonce) ? Number(object.lastObservedEventNonce) : 0,
      outgoingTxs: Array.isArray(object?.outgoingTxs) ? object.outgoingTxs.map((e: any) => Any.fromJSON(e)) : [],
      confirmations: Array.isArray(object?.confirmations) ? object.confirmations.map((e: any) => Any.fromJSON(e)) : [],
      ethereumEventVoteRecords: Array.isArray(object?.ethereumEventVoteRecords)
        ? object.ethereumEventVoteRecords.map((e: any) => EthereumEventVoteRecord.fromJSON(e))
        : [],
      delegateKeys: Array.isArray(object?.delegateKeys)
        ? object.delegateKeys.map((e: any) => MsgDelegateKeys.fromJSON(e))
        : [],
      erc20ToDenoms: Array.isArray(object?.erc20ToDenoms)
        ? object.erc20ToDenoms.map((e: any) => ERC20ToDenom.fromJSON(e))
        : [],
      unbatchedSendToEthereumTxs: Array.isArray(object?.unbatchedSendToEthereumTxs)
        ? object.unbatchedSendToEthereumTxs.map((e: any) => SendToEthereum.fromJSON(e))
        : [],
    };
  },

  toJSON(message: GenesisState): unknown {
    const obj: any = {};
    message.params !== undefined && (obj.params = message.params ? Params.toJSON(message.params) : undefined);
    message.lastObservedEventNonce !== undefined
      && (obj.lastObservedEventNonce = Math.round(message.lastObservedEventNonce));
    if (message.outgoingTxs) {
      obj.outgoingTxs = message.outgoingTxs.map((e) => e ? Any.toJSON(e) : undefined);
    } else {
      obj.outgoingTxs = [];
    }
    if (message.confirmations) {
      obj.confirmations = message.confirmations.map((e) => e ? Any.toJSON(e) : undefined);
    } else {
      obj.confirmations = [];
    }
    if (message.ethereumEventVoteRecords) {
      obj.ethereumEventVoteRecords = message.ethereumEventVoteRecords.map((e) =>
        e ? EthereumEventVoteRecord.toJSON(e) : undefined
      );
    } else {
      obj.ethereumEventVoteRecords = [];
    }
    if (message.delegateKeys) {
      obj.delegateKeys = message.delegateKeys.map((e) => e ? MsgDelegateKeys.toJSON(e) : undefined);
    } else {
      obj.delegateKeys = [];
    }
    if (message.erc20ToDenoms) {
      obj.erc20ToDenoms = message.erc20ToDenoms.map((e) => e ? ERC20ToDenom.toJSON(e) : undefined);
    } else {
      obj.erc20ToDenoms = [];
    }
    if (message.unbatchedSendToEthereumTxs) {
      obj.unbatchedSendToEthereumTxs = message.unbatchedSendToEthereumTxs.map((e) =>
        e ? SendToEthereum.toJSON(e) : undefined
      );
    } else {
      obj.unbatchedSendToEthereumTxs = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GenesisState>, I>>(object: I): GenesisState {
    const message = createBaseGenesisState();
    message.params = (object.params !== undefined && object.params !== null)
      ? Params.fromPartial(object.params)
      : undefined;
    message.lastObservedEventNonce = object.lastObservedEventNonce ?? 0;
    message.outgoingTxs = object.outgoingTxs?.map((e) => Any.fromPartial(e)) || [];
    message.confirmations = object.confirmations?.map((e) => Any.fromPartial(e)) || [];
    message.ethereumEventVoteRecords =
      object.ethereumEventVoteRecords?.map((e) => EthereumEventVoteRecord.fromPartial(e)) || [];
    message.delegateKeys = object.delegateKeys?.map((e) => MsgDelegateKeys.fromPartial(e)) || [];
    message.erc20ToDenoms = object.erc20ToDenoms?.map((e) => ERC20ToDenom.fromPartial(e)) || [];
    message.unbatchedSendToEthereumTxs = object.unbatchedSendToEthereumTxs?.map((e) => SendToEthereum.fromPartial(e))
      || [];
    return message;
  },
};

function createBaseERC20ToDenom(): ERC20ToDenom {
  return { erc20: "", denom: "" };
}

export const ERC20ToDenom = {
  encode(message: ERC20ToDenom, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.erc20 !== "") {
      writer.uint32(10).string(message.erc20);
    }
    if (message.denom !== "") {
      writer.uint32(18).string(message.denom);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ERC20ToDenom {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseERC20ToDenom();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.erc20 = reader.string();
          break;
        case 2:
          message.denom = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ERC20ToDenom {
    return {
      erc20: isSet(object.erc20) ? String(object.erc20) : "",
      denom: isSet(object.denom) ? String(object.denom) : "",
    };
  },

  toJSON(message: ERC20ToDenom): unknown {
    const obj: any = {};
    message.erc20 !== undefined && (obj.erc20 = message.erc20);
    message.denom !== undefined && (obj.denom = message.denom);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<ERC20ToDenom>, I>>(object: I): ERC20ToDenom {
    const message = createBaseERC20ToDenom();
    message.erc20 = object.erc20 ?? "";
    message.denom = object.denom ?? "";
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
