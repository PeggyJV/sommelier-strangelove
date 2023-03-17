/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";
import { PageRequest, PageResponse } from "../../cosmos/base/query/v1beta1/pagination";
import { Coin } from "../../cosmos/base/v1beta1/coin";
import { Params } from "./genesis";
import { BatchTx, ContractCallTx, LatestEthereumBlockHeight, SendToEthereum, SignerSetTx } from "./gravity";
import { BatchTxConfirmation, ContractCallTxConfirmation, MsgDelegateKeys, SignerSetTxConfirmation } from "./msgs";

export const protobufPackage = "gravity.v1";

/** rpc Params */
export interface ParamsRequest {
}

export interface ParamsResponse {
  params: Params | undefined;
}

/** rpc SignerSetTx */
export interface SignerSetTxRequest {
  signerSetNonce: number;
}

export interface LatestSignerSetTxRequest {
}

export interface SignerSetTxResponse {
  signerSet: SignerSetTx | undefined;
}

/** rpc BatchTx */
export interface BatchTxRequest {
  tokenContract: string;
  batchNonce: number;
}

export interface BatchTxResponse {
  batch: BatchTx | undefined;
}

/** rpc ContractCallTx */
export interface ContractCallTxRequest {
  invalidationScope: Uint8Array;
  invalidationNonce: number;
}

export interface ContractCallTxResponse {
  logicCall: ContractCallTx | undefined;
}

/** rpc SignerSetTxConfirmations */
export interface SignerSetTxConfirmationsRequest {
  signerSetNonce: number;
}

export interface SignerSetTxConfirmationsResponse {
  signatures: SignerSetTxConfirmation[];
}

/** rpc SignerSetTxs */
export interface SignerSetTxsRequest {
  pagination: PageRequest | undefined;
}

export interface SignerSetTxsResponse {
  signerSets: SignerSetTx[];
  pagination: PageResponse | undefined;
}

/** rpc BatchTxs */
export interface BatchTxsRequest {
  pagination: PageRequest | undefined;
}

export interface BatchTxsResponse {
  batches: BatchTx[];
  pagination: PageResponse | undefined;
}

/** rpc ContractCallTxs */
export interface ContractCallTxsRequest {
  pagination: PageRequest | undefined;
}

export interface ContractCallTxsResponse {
  calls: ContractCallTx[];
  pagination: PageResponse | undefined;
}

/** rpc UnsignedSignerSetTxs */
export interface UnsignedSignerSetTxsRequest {
  /**
   * NOTE: this is an sdk.AccAddress and can represent either the
   * orchestrator address or the corresponding validator address
   */
  address: string;
}

export interface UnsignedSignerSetTxsResponse {
  signerSets: SignerSetTx[];
}

export interface UnsignedBatchTxsRequest {
  /**
   * NOTE: this is an sdk.AccAddress and can represent either the
   * orchestrator address or the corresponding validator address
   */
  address: string;
}

export interface UnsignedBatchTxsResponse {
  /** Note these are returned with the signature empty */
  batches: BatchTx[];
}

/** rpc UnsignedContractCallTxs */
export interface UnsignedContractCallTxsRequest {
  address: string;
}

export interface UnsignedContractCallTxsResponse {
  calls: ContractCallTx[];
}

export interface BatchTxFeesRequest {
}

export interface BatchTxFeesResponse {
  fees: Coin[];
}

export interface ContractCallTxConfirmationsRequest {
  invalidationScope: Uint8Array;
  invalidationNonce: number;
}

export interface ContractCallTxConfirmationsResponse {
  signatures: ContractCallTxConfirmation[];
}

export interface BatchTxConfirmationsRequest {
  batchNonce: number;
  tokenContract: string;
}

export interface BatchTxConfirmationsResponse {
  signatures: BatchTxConfirmation[];
}

export interface LastSubmittedEthereumEventRequest {
  address: string;
}

export interface LastSubmittedEthereumEventResponse {
  eventNonce: number;
}

export interface ERC20ToDenomRequest {
  erc20: string;
}

export interface ERC20ToDenomResponse {
  denom: string;
  cosmosOriginated: boolean;
}

export interface DenomToERC20ParamsRequest {
  denom: string;
}

export interface DenomToERC20ParamsResponse {
  baseDenom: string;
  erc20Name: string;
  erc20Symbol: string;
  erc20Decimals: number;
}

export interface DenomToERC20Request {
  denom: string;
}

export interface DenomToERC20Response {
  erc20: string;
  cosmosOriginated: boolean;
}

export interface DelegateKeysByValidatorRequest {
  validatorAddress: string;
}

export interface DelegateKeysByValidatorResponse {
  ethAddress: string;
  orchestratorAddress: string;
}

export interface DelegateKeysByEthereumSignerRequest {
  ethereumSigner: string;
}

export interface DelegateKeysByEthereumSignerResponse {
  validatorAddress: string;
  orchestratorAddress: string;
}

export interface DelegateKeysByOrchestratorRequest {
  orchestratorAddress: string;
}

export interface DelegateKeysByOrchestratorResponse {
  validatorAddress: string;
  ethereumSigner: string;
}

export interface DelegateKeysRequest {
}

export interface DelegateKeysResponse {
  delegateKeys: MsgDelegateKeys[];
}

/** NOTE: if there is no sender address, return all */
export interface BatchedSendToEthereumsRequest {
  /**
   * todo: figure out how to paginate given n Batches with m Send To Ethereums
   *  cosmos.base.query.v1beta1.PageRequest pagination = 2;
   */
  senderAddress: string;
}

export interface BatchedSendToEthereumsResponse {
  /** cosmos.base.query.v1beta1.PageResponse pagination = 2; */
  sendToEthereums: SendToEthereum[];
}

export interface UnbatchedSendToEthereumsRequest {
  senderAddress: string;
  pagination: PageRequest | undefined;
}

export interface UnbatchedSendToEthereumsResponse {
  sendToEthereums: SendToEthereum[];
  pagination: PageResponse | undefined;
}

export interface LastObservedEthereumHeightRequest {
}

export interface LastObservedEthereumHeightResponse {
  lastObservedEthereumHeight: LatestEthereumBlockHeight | undefined;
}

function createBaseParamsRequest(): ParamsRequest {
  return {};
}

export const ParamsRequest = {
  encode(_: ParamsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ParamsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseParamsRequest();
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

  fromJSON(_: any): ParamsRequest {
    return {};
  },

  toJSON(_: ParamsRequest): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<ParamsRequest>, I>>(_: I): ParamsRequest {
    const message = createBaseParamsRequest();
    return message;
  },
};

function createBaseParamsResponse(): ParamsResponse {
  return { params: undefined };
}

export const ParamsResponse = {
  encode(message: ParamsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.params !== undefined) {
      Params.encode(message.params, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ParamsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseParamsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.params = Params.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ParamsResponse {
    return { params: isSet(object.params) ? Params.fromJSON(object.params) : undefined };
  },

  toJSON(message: ParamsResponse): unknown {
    const obj: any = {};
    message.params !== undefined && (obj.params = message.params ? Params.toJSON(message.params) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<ParamsResponse>, I>>(object: I): ParamsResponse {
    const message = createBaseParamsResponse();
    message.params = (object.params !== undefined && object.params !== null)
      ? Params.fromPartial(object.params)
      : undefined;
    return message;
  },
};

function createBaseSignerSetTxRequest(): SignerSetTxRequest {
  return { signerSetNonce: 0 };
}

export const SignerSetTxRequest = {
  encode(message: SignerSetTxRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.signerSetNonce !== 0) {
      writer.uint32(8).uint64(message.signerSetNonce);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SignerSetTxRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSignerSetTxRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.signerSetNonce = longToNumber(reader.uint64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): SignerSetTxRequest {
    return { signerSetNonce: isSet(object.signerSetNonce) ? Number(object.signerSetNonce) : 0 };
  },

  toJSON(message: SignerSetTxRequest): unknown {
    const obj: any = {};
    message.signerSetNonce !== undefined && (obj.signerSetNonce = Math.round(message.signerSetNonce));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<SignerSetTxRequest>, I>>(object: I): SignerSetTxRequest {
    const message = createBaseSignerSetTxRequest();
    message.signerSetNonce = object.signerSetNonce ?? 0;
    return message;
  },
};

function createBaseLatestSignerSetTxRequest(): LatestSignerSetTxRequest {
  return {};
}

export const LatestSignerSetTxRequest = {
  encode(_: LatestSignerSetTxRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): LatestSignerSetTxRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLatestSignerSetTxRequest();
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

  fromJSON(_: any): LatestSignerSetTxRequest {
    return {};
  },

  toJSON(_: LatestSignerSetTxRequest): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<LatestSignerSetTxRequest>, I>>(_: I): LatestSignerSetTxRequest {
    const message = createBaseLatestSignerSetTxRequest();
    return message;
  },
};

function createBaseSignerSetTxResponse(): SignerSetTxResponse {
  return { signerSet: undefined };
}

export const SignerSetTxResponse = {
  encode(message: SignerSetTxResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.signerSet !== undefined) {
      SignerSetTx.encode(message.signerSet, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SignerSetTxResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSignerSetTxResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.signerSet = SignerSetTx.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): SignerSetTxResponse {
    return { signerSet: isSet(object.signerSet) ? SignerSetTx.fromJSON(object.signerSet) : undefined };
  },

  toJSON(message: SignerSetTxResponse): unknown {
    const obj: any = {};
    message.signerSet !== undefined
      && (obj.signerSet = message.signerSet ? SignerSetTx.toJSON(message.signerSet) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<SignerSetTxResponse>, I>>(object: I): SignerSetTxResponse {
    const message = createBaseSignerSetTxResponse();
    message.signerSet = (object.signerSet !== undefined && object.signerSet !== null)
      ? SignerSetTx.fromPartial(object.signerSet)
      : undefined;
    return message;
  },
};

function createBaseBatchTxRequest(): BatchTxRequest {
  return { tokenContract: "", batchNonce: 0 };
}

export const BatchTxRequest = {
  encode(message: BatchTxRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.tokenContract !== "") {
      writer.uint32(10).string(message.tokenContract);
    }
    if (message.batchNonce !== 0) {
      writer.uint32(16).uint64(message.batchNonce);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): BatchTxRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBatchTxRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.tokenContract = reader.string();
          break;
        case 2:
          message.batchNonce = longToNumber(reader.uint64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): BatchTxRequest {
    return {
      tokenContract: isSet(object.tokenContract) ? String(object.tokenContract) : "",
      batchNonce: isSet(object.batchNonce) ? Number(object.batchNonce) : 0,
    };
  },

  toJSON(message: BatchTxRequest): unknown {
    const obj: any = {};
    message.tokenContract !== undefined && (obj.tokenContract = message.tokenContract);
    message.batchNonce !== undefined && (obj.batchNonce = Math.round(message.batchNonce));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<BatchTxRequest>, I>>(object: I): BatchTxRequest {
    const message = createBaseBatchTxRequest();
    message.tokenContract = object.tokenContract ?? "";
    message.batchNonce = object.batchNonce ?? 0;
    return message;
  },
};

function createBaseBatchTxResponse(): BatchTxResponse {
  return { batch: undefined };
}

export const BatchTxResponse = {
  encode(message: BatchTxResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.batch !== undefined) {
      BatchTx.encode(message.batch, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): BatchTxResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBatchTxResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.batch = BatchTx.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): BatchTxResponse {
    return { batch: isSet(object.batch) ? BatchTx.fromJSON(object.batch) : undefined };
  },

  toJSON(message: BatchTxResponse): unknown {
    const obj: any = {};
    message.batch !== undefined && (obj.batch = message.batch ? BatchTx.toJSON(message.batch) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<BatchTxResponse>, I>>(object: I): BatchTxResponse {
    const message = createBaseBatchTxResponse();
    message.batch = (object.batch !== undefined && object.batch !== null)
      ? BatchTx.fromPartial(object.batch)
      : undefined;
    return message;
  },
};

function createBaseContractCallTxRequest(): ContractCallTxRequest {
  return { invalidationScope: new Uint8Array(), invalidationNonce: 0 };
}

export const ContractCallTxRequest = {
  encode(message: ContractCallTxRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.invalidationScope.length !== 0) {
      writer.uint32(10).bytes(message.invalidationScope);
    }
    if (message.invalidationNonce !== 0) {
      writer.uint32(16).uint64(message.invalidationNonce);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ContractCallTxRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseContractCallTxRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.invalidationScope = reader.bytes();
          break;
        case 2:
          message.invalidationNonce = longToNumber(reader.uint64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ContractCallTxRequest {
    return {
      invalidationScope: isSet(object.invalidationScope) ? bytesFromBase64(object.invalidationScope) : new Uint8Array(),
      invalidationNonce: isSet(object.invalidationNonce) ? Number(object.invalidationNonce) : 0,
    };
  },

  toJSON(message: ContractCallTxRequest): unknown {
    const obj: any = {};
    message.invalidationScope !== undefined
      && (obj.invalidationScope = base64FromBytes(
        message.invalidationScope !== undefined ? message.invalidationScope : new Uint8Array(),
      ));
    message.invalidationNonce !== undefined && (obj.invalidationNonce = Math.round(message.invalidationNonce));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<ContractCallTxRequest>, I>>(object: I): ContractCallTxRequest {
    const message = createBaseContractCallTxRequest();
    message.invalidationScope = object.invalidationScope ?? new Uint8Array();
    message.invalidationNonce = object.invalidationNonce ?? 0;
    return message;
  },
};

function createBaseContractCallTxResponse(): ContractCallTxResponse {
  return { logicCall: undefined };
}

export const ContractCallTxResponse = {
  encode(message: ContractCallTxResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.logicCall !== undefined) {
      ContractCallTx.encode(message.logicCall, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ContractCallTxResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseContractCallTxResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.logicCall = ContractCallTx.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ContractCallTxResponse {
    return { logicCall: isSet(object.logicCall) ? ContractCallTx.fromJSON(object.logicCall) : undefined };
  },

  toJSON(message: ContractCallTxResponse): unknown {
    const obj: any = {};
    message.logicCall !== undefined
      && (obj.logicCall = message.logicCall ? ContractCallTx.toJSON(message.logicCall) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<ContractCallTxResponse>, I>>(object: I): ContractCallTxResponse {
    const message = createBaseContractCallTxResponse();
    message.logicCall = (object.logicCall !== undefined && object.logicCall !== null)
      ? ContractCallTx.fromPartial(object.logicCall)
      : undefined;
    return message;
  },
};

function createBaseSignerSetTxConfirmationsRequest(): SignerSetTxConfirmationsRequest {
  return { signerSetNonce: 0 };
}

export const SignerSetTxConfirmationsRequest = {
  encode(message: SignerSetTxConfirmationsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.signerSetNonce !== 0) {
      writer.uint32(8).uint64(message.signerSetNonce);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SignerSetTxConfirmationsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSignerSetTxConfirmationsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.signerSetNonce = longToNumber(reader.uint64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): SignerSetTxConfirmationsRequest {
    return { signerSetNonce: isSet(object.signerSetNonce) ? Number(object.signerSetNonce) : 0 };
  },

  toJSON(message: SignerSetTxConfirmationsRequest): unknown {
    const obj: any = {};
    message.signerSetNonce !== undefined && (obj.signerSetNonce = Math.round(message.signerSetNonce));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<SignerSetTxConfirmationsRequest>, I>>(
    object: I,
  ): SignerSetTxConfirmationsRequest {
    const message = createBaseSignerSetTxConfirmationsRequest();
    message.signerSetNonce = object.signerSetNonce ?? 0;
    return message;
  },
};

function createBaseSignerSetTxConfirmationsResponse(): SignerSetTxConfirmationsResponse {
  return { signatures: [] };
}

export const SignerSetTxConfirmationsResponse = {
  encode(message: SignerSetTxConfirmationsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.signatures) {
      SignerSetTxConfirmation.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SignerSetTxConfirmationsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSignerSetTxConfirmationsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.signatures.push(SignerSetTxConfirmation.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): SignerSetTxConfirmationsResponse {
    return {
      signatures: Array.isArray(object?.signatures)
        ? object.signatures.map((e: any) => SignerSetTxConfirmation.fromJSON(e))
        : [],
    };
  },

  toJSON(message: SignerSetTxConfirmationsResponse): unknown {
    const obj: any = {};
    if (message.signatures) {
      obj.signatures = message.signatures.map((e) => e ? SignerSetTxConfirmation.toJSON(e) : undefined);
    } else {
      obj.signatures = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<SignerSetTxConfirmationsResponse>, I>>(
    object: I,
  ): SignerSetTxConfirmationsResponse {
    const message = createBaseSignerSetTxConfirmationsResponse();
    message.signatures = object.signatures?.map((e) => SignerSetTxConfirmation.fromPartial(e)) || [];
    return message;
  },
};

function createBaseSignerSetTxsRequest(): SignerSetTxsRequest {
  return { pagination: undefined };
}

export const SignerSetTxsRequest = {
  encode(message: SignerSetTxsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.pagination !== undefined) {
      PageRequest.encode(message.pagination, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SignerSetTxsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSignerSetTxsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.pagination = PageRequest.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): SignerSetTxsRequest {
    return { pagination: isSet(object.pagination) ? PageRequest.fromJSON(object.pagination) : undefined };
  },

  toJSON(message: SignerSetTxsRequest): unknown {
    const obj: any = {};
    message.pagination !== undefined
      && (obj.pagination = message.pagination ? PageRequest.toJSON(message.pagination) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<SignerSetTxsRequest>, I>>(object: I): SignerSetTxsRequest {
    const message = createBaseSignerSetTxsRequest();
    message.pagination = (object.pagination !== undefined && object.pagination !== null)
      ? PageRequest.fromPartial(object.pagination)
      : undefined;
    return message;
  },
};

function createBaseSignerSetTxsResponse(): SignerSetTxsResponse {
  return { signerSets: [], pagination: undefined };
}

export const SignerSetTxsResponse = {
  encode(message: SignerSetTxsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.signerSets) {
      SignerSetTx.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.pagination !== undefined) {
      PageResponse.encode(message.pagination, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SignerSetTxsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSignerSetTxsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.signerSets.push(SignerSetTx.decode(reader, reader.uint32()));
          break;
        case 2:
          message.pagination = PageResponse.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): SignerSetTxsResponse {
    return {
      signerSets: Array.isArray(object?.signerSets) ? object.signerSets.map((e: any) => SignerSetTx.fromJSON(e)) : [],
      pagination: isSet(object.pagination) ? PageResponse.fromJSON(object.pagination) : undefined,
    };
  },

  toJSON(message: SignerSetTxsResponse): unknown {
    const obj: any = {};
    if (message.signerSets) {
      obj.signerSets = message.signerSets.map((e) => e ? SignerSetTx.toJSON(e) : undefined);
    } else {
      obj.signerSets = [];
    }
    message.pagination !== undefined
      && (obj.pagination = message.pagination ? PageResponse.toJSON(message.pagination) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<SignerSetTxsResponse>, I>>(object: I): SignerSetTxsResponse {
    const message = createBaseSignerSetTxsResponse();
    message.signerSets = object.signerSets?.map((e) => SignerSetTx.fromPartial(e)) || [];
    message.pagination = (object.pagination !== undefined && object.pagination !== null)
      ? PageResponse.fromPartial(object.pagination)
      : undefined;
    return message;
  },
};

function createBaseBatchTxsRequest(): BatchTxsRequest {
  return { pagination: undefined };
}

export const BatchTxsRequest = {
  encode(message: BatchTxsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.pagination !== undefined) {
      PageRequest.encode(message.pagination, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): BatchTxsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBatchTxsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.pagination = PageRequest.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): BatchTxsRequest {
    return { pagination: isSet(object.pagination) ? PageRequest.fromJSON(object.pagination) : undefined };
  },

  toJSON(message: BatchTxsRequest): unknown {
    const obj: any = {};
    message.pagination !== undefined
      && (obj.pagination = message.pagination ? PageRequest.toJSON(message.pagination) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<BatchTxsRequest>, I>>(object: I): BatchTxsRequest {
    const message = createBaseBatchTxsRequest();
    message.pagination = (object.pagination !== undefined && object.pagination !== null)
      ? PageRequest.fromPartial(object.pagination)
      : undefined;
    return message;
  },
};

function createBaseBatchTxsResponse(): BatchTxsResponse {
  return { batches: [], pagination: undefined };
}

export const BatchTxsResponse = {
  encode(message: BatchTxsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.batches) {
      BatchTx.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.pagination !== undefined) {
      PageResponse.encode(message.pagination, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): BatchTxsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBatchTxsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.batches.push(BatchTx.decode(reader, reader.uint32()));
          break;
        case 2:
          message.pagination = PageResponse.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): BatchTxsResponse {
    return {
      batches: Array.isArray(object?.batches) ? object.batches.map((e: any) => BatchTx.fromJSON(e)) : [],
      pagination: isSet(object.pagination) ? PageResponse.fromJSON(object.pagination) : undefined,
    };
  },

  toJSON(message: BatchTxsResponse): unknown {
    const obj: any = {};
    if (message.batches) {
      obj.batches = message.batches.map((e) => e ? BatchTx.toJSON(e) : undefined);
    } else {
      obj.batches = [];
    }
    message.pagination !== undefined
      && (obj.pagination = message.pagination ? PageResponse.toJSON(message.pagination) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<BatchTxsResponse>, I>>(object: I): BatchTxsResponse {
    const message = createBaseBatchTxsResponse();
    message.batches = object.batches?.map((e) => BatchTx.fromPartial(e)) || [];
    message.pagination = (object.pagination !== undefined && object.pagination !== null)
      ? PageResponse.fromPartial(object.pagination)
      : undefined;
    return message;
  },
};

function createBaseContractCallTxsRequest(): ContractCallTxsRequest {
  return { pagination: undefined };
}

export const ContractCallTxsRequest = {
  encode(message: ContractCallTxsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.pagination !== undefined) {
      PageRequest.encode(message.pagination, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ContractCallTxsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseContractCallTxsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.pagination = PageRequest.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ContractCallTxsRequest {
    return { pagination: isSet(object.pagination) ? PageRequest.fromJSON(object.pagination) : undefined };
  },

  toJSON(message: ContractCallTxsRequest): unknown {
    const obj: any = {};
    message.pagination !== undefined
      && (obj.pagination = message.pagination ? PageRequest.toJSON(message.pagination) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<ContractCallTxsRequest>, I>>(object: I): ContractCallTxsRequest {
    const message = createBaseContractCallTxsRequest();
    message.pagination = (object.pagination !== undefined && object.pagination !== null)
      ? PageRequest.fromPartial(object.pagination)
      : undefined;
    return message;
  },
};

function createBaseContractCallTxsResponse(): ContractCallTxsResponse {
  return { calls: [], pagination: undefined };
}

export const ContractCallTxsResponse = {
  encode(message: ContractCallTxsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.calls) {
      ContractCallTx.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.pagination !== undefined) {
      PageResponse.encode(message.pagination, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ContractCallTxsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseContractCallTxsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.calls.push(ContractCallTx.decode(reader, reader.uint32()));
          break;
        case 2:
          message.pagination = PageResponse.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ContractCallTxsResponse {
    return {
      calls: Array.isArray(object?.calls) ? object.calls.map((e: any) => ContractCallTx.fromJSON(e)) : [],
      pagination: isSet(object.pagination) ? PageResponse.fromJSON(object.pagination) : undefined,
    };
  },

  toJSON(message: ContractCallTxsResponse): unknown {
    const obj: any = {};
    if (message.calls) {
      obj.calls = message.calls.map((e) => e ? ContractCallTx.toJSON(e) : undefined);
    } else {
      obj.calls = [];
    }
    message.pagination !== undefined
      && (obj.pagination = message.pagination ? PageResponse.toJSON(message.pagination) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<ContractCallTxsResponse>, I>>(object: I): ContractCallTxsResponse {
    const message = createBaseContractCallTxsResponse();
    message.calls = object.calls?.map((e) => ContractCallTx.fromPartial(e)) || [];
    message.pagination = (object.pagination !== undefined && object.pagination !== null)
      ? PageResponse.fromPartial(object.pagination)
      : undefined;
    return message;
  },
};

function createBaseUnsignedSignerSetTxsRequest(): UnsignedSignerSetTxsRequest {
  return { address: "" };
}

export const UnsignedSignerSetTxsRequest = {
  encode(message: UnsignedSignerSetTxsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.address !== "") {
      writer.uint32(10).string(message.address);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UnsignedSignerSetTxsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUnsignedSignerSetTxsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.address = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): UnsignedSignerSetTxsRequest {
    return { address: isSet(object.address) ? String(object.address) : "" };
  },

  toJSON(message: UnsignedSignerSetTxsRequest): unknown {
    const obj: any = {};
    message.address !== undefined && (obj.address = message.address);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<UnsignedSignerSetTxsRequest>, I>>(object: I): UnsignedSignerSetTxsRequest {
    const message = createBaseUnsignedSignerSetTxsRequest();
    message.address = object.address ?? "";
    return message;
  },
};

function createBaseUnsignedSignerSetTxsResponse(): UnsignedSignerSetTxsResponse {
  return { signerSets: [] };
}

export const UnsignedSignerSetTxsResponse = {
  encode(message: UnsignedSignerSetTxsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.signerSets) {
      SignerSetTx.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UnsignedSignerSetTxsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUnsignedSignerSetTxsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.signerSets.push(SignerSetTx.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): UnsignedSignerSetTxsResponse {
    return {
      signerSets: Array.isArray(object?.signerSets) ? object.signerSets.map((e: any) => SignerSetTx.fromJSON(e)) : [],
    };
  },

  toJSON(message: UnsignedSignerSetTxsResponse): unknown {
    const obj: any = {};
    if (message.signerSets) {
      obj.signerSets = message.signerSets.map((e) => e ? SignerSetTx.toJSON(e) : undefined);
    } else {
      obj.signerSets = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<UnsignedSignerSetTxsResponse>, I>>(object: I): UnsignedSignerSetTxsResponse {
    const message = createBaseUnsignedSignerSetTxsResponse();
    message.signerSets = object.signerSets?.map((e) => SignerSetTx.fromPartial(e)) || [];
    return message;
  },
};

function createBaseUnsignedBatchTxsRequest(): UnsignedBatchTxsRequest {
  return { address: "" };
}

export const UnsignedBatchTxsRequest = {
  encode(message: UnsignedBatchTxsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.address !== "") {
      writer.uint32(10).string(message.address);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UnsignedBatchTxsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUnsignedBatchTxsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.address = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): UnsignedBatchTxsRequest {
    return { address: isSet(object.address) ? String(object.address) : "" };
  },

  toJSON(message: UnsignedBatchTxsRequest): unknown {
    const obj: any = {};
    message.address !== undefined && (obj.address = message.address);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<UnsignedBatchTxsRequest>, I>>(object: I): UnsignedBatchTxsRequest {
    const message = createBaseUnsignedBatchTxsRequest();
    message.address = object.address ?? "";
    return message;
  },
};

function createBaseUnsignedBatchTxsResponse(): UnsignedBatchTxsResponse {
  return { batches: [] };
}

export const UnsignedBatchTxsResponse = {
  encode(message: UnsignedBatchTxsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.batches) {
      BatchTx.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UnsignedBatchTxsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUnsignedBatchTxsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.batches.push(BatchTx.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): UnsignedBatchTxsResponse {
    return { batches: Array.isArray(object?.batches) ? object.batches.map((e: any) => BatchTx.fromJSON(e)) : [] };
  },

  toJSON(message: UnsignedBatchTxsResponse): unknown {
    const obj: any = {};
    if (message.batches) {
      obj.batches = message.batches.map((e) => e ? BatchTx.toJSON(e) : undefined);
    } else {
      obj.batches = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<UnsignedBatchTxsResponse>, I>>(object: I): UnsignedBatchTxsResponse {
    const message = createBaseUnsignedBatchTxsResponse();
    message.batches = object.batches?.map((e) => BatchTx.fromPartial(e)) || [];
    return message;
  },
};

function createBaseUnsignedContractCallTxsRequest(): UnsignedContractCallTxsRequest {
  return { address: "" };
}

export const UnsignedContractCallTxsRequest = {
  encode(message: UnsignedContractCallTxsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.address !== "") {
      writer.uint32(10).string(message.address);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UnsignedContractCallTxsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUnsignedContractCallTxsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.address = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): UnsignedContractCallTxsRequest {
    return { address: isSet(object.address) ? String(object.address) : "" };
  },

  toJSON(message: UnsignedContractCallTxsRequest): unknown {
    const obj: any = {};
    message.address !== undefined && (obj.address = message.address);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<UnsignedContractCallTxsRequest>, I>>(
    object: I,
  ): UnsignedContractCallTxsRequest {
    const message = createBaseUnsignedContractCallTxsRequest();
    message.address = object.address ?? "";
    return message;
  },
};

function createBaseUnsignedContractCallTxsResponse(): UnsignedContractCallTxsResponse {
  return { calls: [] };
}

export const UnsignedContractCallTxsResponse = {
  encode(message: UnsignedContractCallTxsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.calls) {
      ContractCallTx.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UnsignedContractCallTxsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUnsignedContractCallTxsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.calls.push(ContractCallTx.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): UnsignedContractCallTxsResponse {
    return { calls: Array.isArray(object?.calls) ? object.calls.map((e: any) => ContractCallTx.fromJSON(e)) : [] };
  },

  toJSON(message: UnsignedContractCallTxsResponse): unknown {
    const obj: any = {};
    if (message.calls) {
      obj.calls = message.calls.map((e) => e ? ContractCallTx.toJSON(e) : undefined);
    } else {
      obj.calls = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<UnsignedContractCallTxsResponse>, I>>(
    object: I,
  ): UnsignedContractCallTxsResponse {
    const message = createBaseUnsignedContractCallTxsResponse();
    message.calls = object.calls?.map((e) => ContractCallTx.fromPartial(e)) || [];
    return message;
  },
};

function createBaseBatchTxFeesRequest(): BatchTxFeesRequest {
  return {};
}

export const BatchTxFeesRequest = {
  encode(_: BatchTxFeesRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): BatchTxFeesRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBatchTxFeesRequest();
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

  fromJSON(_: any): BatchTxFeesRequest {
    return {};
  },

  toJSON(_: BatchTxFeesRequest): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<BatchTxFeesRequest>, I>>(_: I): BatchTxFeesRequest {
    const message = createBaseBatchTxFeesRequest();
    return message;
  },
};

function createBaseBatchTxFeesResponse(): BatchTxFeesResponse {
  return { fees: [] };
}

export const BatchTxFeesResponse = {
  encode(message: BatchTxFeesResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.fees) {
      Coin.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): BatchTxFeesResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBatchTxFeesResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.fees.push(Coin.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): BatchTxFeesResponse {
    return { fees: Array.isArray(object?.fees) ? object.fees.map((e: any) => Coin.fromJSON(e)) : [] };
  },

  toJSON(message: BatchTxFeesResponse): unknown {
    const obj: any = {};
    if (message.fees) {
      obj.fees = message.fees.map((e) => e ? Coin.toJSON(e) : undefined);
    } else {
      obj.fees = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<BatchTxFeesResponse>, I>>(object: I): BatchTxFeesResponse {
    const message = createBaseBatchTxFeesResponse();
    message.fees = object.fees?.map((e) => Coin.fromPartial(e)) || [];
    return message;
  },
};

function createBaseContractCallTxConfirmationsRequest(): ContractCallTxConfirmationsRequest {
  return { invalidationScope: new Uint8Array(), invalidationNonce: 0 };
}

export const ContractCallTxConfirmationsRequest = {
  encode(message: ContractCallTxConfirmationsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.invalidationScope.length !== 0) {
      writer.uint32(10).bytes(message.invalidationScope);
    }
    if (message.invalidationNonce !== 0) {
      writer.uint32(16).uint64(message.invalidationNonce);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ContractCallTxConfirmationsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseContractCallTxConfirmationsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.invalidationScope = reader.bytes();
          break;
        case 2:
          message.invalidationNonce = longToNumber(reader.uint64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ContractCallTxConfirmationsRequest {
    return {
      invalidationScope: isSet(object.invalidationScope) ? bytesFromBase64(object.invalidationScope) : new Uint8Array(),
      invalidationNonce: isSet(object.invalidationNonce) ? Number(object.invalidationNonce) : 0,
    };
  },

  toJSON(message: ContractCallTxConfirmationsRequest): unknown {
    const obj: any = {};
    message.invalidationScope !== undefined
      && (obj.invalidationScope = base64FromBytes(
        message.invalidationScope !== undefined ? message.invalidationScope : new Uint8Array(),
      ));
    message.invalidationNonce !== undefined && (obj.invalidationNonce = Math.round(message.invalidationNonce));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<ContractCallTxConfirmationsRequest>, I>>(
    object: I,
  ): ContractCallTxConfirmationsRequest {
    const message = createBaseContractCallTxConfirmationsRequest();
    message.invalidationScope = object.invalidationScope ?? new Uint8Array();
    message.invalidationNonce = object.invalidationNonce ?? 0;
    return message;
  },
};

function createBaseContractCallTxConfirmationsResponse(): ContractCallTxConfirmationsResponse {
  return { signatures: [] };
}

export const ContractCallTxConfirmationsResponse = {
  encode(message: ContractCallTxConfirmationsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.signatures) {
      ContractCallTxConfirmation.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ContractCallTxConfirmationsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseContractCallTxConfirmationsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.signatures.push(ContractCallTxConfirmation.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ContractCallTxConfirmationsResponse {
    return {
      signatures: Array.isArray(object?.signatures)
        ? object.signatures.map((e: any) => ContractCallTxConfirmation.fromJSON(e))
        : [],
    };
  },

  toJSON(message: ContractCallTxConfirmationsResponse): unknown {
    const obj: any = {};
    if (message.signatures) {
      obj.signatures = message.signatures.map((e) => e ? ContractCallTxConfirmation.toJSON(e) : undefined);
    } else {
      obj.signatures = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<ContractCallTxConfirmationsResponse>, I>>(
    object: I,
  ): ContractCallTxConfirmationsResponse {
    const message = createBaseContractCallTxConfirmationsResponse();
    message.signatures = object.signatures?.map((e) => ContractCallTxConfirmation.fromPartial(e)) || [];
    return message;
  },
};

function createBaseBatchTxConfirmationsRequest(): BatchTxConfirmationsRequest {
  return { batchNonce: 0, tokenContract: "" };
}

export const BatchTxConfirmationsRequest = {
  encode(message: BatchTxConfirmationsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.batchNonce !== 0) {
      writer.uint32(8).uint64(message.batchNonce);
    }
    if (message.tokenContract !== "") {
      writer.uint32(18).string(message.tokenContract);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): BatchTxConfirmationsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBatchTxConfirmationsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.batchNonce = longToNumber(reader.uint64() as Long);
          break;
        case 2:
          message.tokenContract = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): BatchTxConfirmationsRequest {
    return {
      batchNonce: isSet(object.batchNonce) ? Number(object.batchNonce) : 0,
      tokenContract: isSet(object.tokenContract) ? String(object.tokenContract) : "",
    };
  },

  toJSON(message: BatchTxConfirmationsRequest): unknown {
    const obj: any = {};
    message.batchNonce !== undefined && (obj.batchNonce = Math.round(message.batchNonce));
    message.tokenContract !== undefined && (obj.tokenContract = message.tokenContract);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<BatchTxConfirmationsRequest>, I>>(object: I): BatchTxConfirmationsRequest {
    const message = createBaseBatchTxConfirmationsRequest();
    message.batchNonce = object.batchNonce ?? 0;
    message.tokenContract = object.tokenContract ?? "";
    return message;
  },
};

function createBaseBatchTxConfirmationsResponse(): BatchTxConfirmationsResponse {
  return { signatures: [] };
}

export const BatchTxConfirmationsResponse = {
  encode(message: BatchTxConfirmationsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.signatures) {
      BatchTxConfirmation.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): BatchTxConfirmationsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBatchTxConfirmationsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.signatures.push(BatchTxConfirmation.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): BatchTxConfirmationsResponse {
    return {
      signatures: Array.isArray(object?.signatures)
        ? object.signatures.map((e: any) => BatchTxConfirmation.fromJSON(e))
        : [],
    };
  },

  toJSON(message: BatchTxConfirmationsResponse): unknown {
    const obj: any = {};
    if (message.signatures) {
      obj.signatures = message.signatures.map((e) => e ? BatchTxConfirmation.toJSON(e) : undefined);
    } else {
      obj.signatures = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<BatchTxConfirmationsResponse>, I>>(object: I): BatchTxConfirmationsResponse {
    const message = createBaseBatchTxConfirmationsResponse();
    message.signatures = object.signatures?.map((e) => BatchTxConfirmation.fromPartial(e)) || [];
    return message;
  },
};

function createBaseLastSubmittedEthereumEventRequest(): LastSubmittedEthereumEventRequest {
  return { address: "" };
}

export const LastSubmittedEthereumEventRequest = {
  encode(message: LastSubmittedEthereumEventRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.address !== "") {
      writer.uint32(10).string(message.address);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): LastSubmittedEthereumEventRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLastSubmittedEthereumEventRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.address = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): LastSubmittedEthereumEventRequest {
    return { address: isSet(object.address) ? String(object.address) : "" };
  },

  toJSON(message: LastSubmittedEthereumEventRequest): unknown {
    const obj: any = {};
    message.address !== undefined && (obj.address = message.address);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<LastSubmittedEthereumEventRequest>, I>>(
    object: I,
  ): LastSubmittedEthereumEventRequest {
    const message = createBaseLastSubmittedEthereumEventRequest();
    message.address = object.address ?? "";
    return message;
  },
};

function createBaseLastSubmittedEthereumEventResponse(): LastSubmittedEthereumEventResponse {
  return { eventNonce: 0 };
}

export const LastSubmittedEthereumEventResponse = {
  encode(message: LastSubmittedEthereumEventResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.eventNonce !== 0) {
      writer.uint32(8).uint64(message.eventNonce);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): LastSubmittedEthereumEventResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLastSubmittedEthereumEventResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.eventNonce = longToNumber(reader.uint64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): LastSubmittedEthereumEventResponse {
    return { eventNonce: isSet(object.eventNonce) ? Number(object.eventNonce) : 0 };
  },

  toJSON(message: LastSubmittedEthereumEventResponse): unknown {
    const obj: any = {};
    message.eventNonce !== undefined && (obj.eventNonce = Math.round(message.eventNonce));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<LastSubmittedEthereumEventResponse>, I>>(
    object: I,
  ): LastSubmittedEthereumEventResponse {
    const message = createBaseLastSubmittedEthereumEventResponse();
    message.eventNonce = object.eventNonce ?? 0;
    return message;
  },
};

function createBaseERC20ToDenomRequest(): ERC20ToDenomRequest {
  return { erc20: "" };
}

export const ERC20ToDenomRequest = {
  encode(message: ERC20ToDenomRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.erc20 !== "") {
      writer.uint32(10).string(message.erc20);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ERC20ToDenomRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseERC20ToDenomRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.erc20 = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ERC20ToDenomRequest {
    return { erc20: isSet(object.erc20) ? String(object.erc20) : "" };
  },

  toJSON(message: ERC20ToDenomRequest): unknown {
    const obj: any = {};
    message.erc20 !== undefined && (obj.erc20 = message.erc20);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<ERC20ToDenomRequest>, I>>(object: I): ERC20ToDenomRequest {
    const message = createBaseERC20ToDenomRequest();
    message.erc20 = object.erc20 ?? "";
    return message;
  },
};

function createBaseERC20ToDenomResponse(): ERC20ToDenomResponse {
  return { denom: "", cosmosOriginated: false };
}

export const ERC20ToDenomResponse = {
  encode(message: ERC20ToDenomResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.denom !== "") {
      writer.uint32(10).string(message.denom);
    }
    if (message.cosmosOriginated === true) {
      writer.uint32(16).bool(message.cosmosOriginated);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ERC20ToDenomResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseERC20ToDenomResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.denom = reader.string();
          break;
        case 2:
          message.cosmosOriginated = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ERC20ToDenomResponse {
    return {
      denom: isSet(object.denom) ? String(object.denom) : "",
      cosmosOriginated: isSet(object.cosmosOriginated) ? Boolean(object.cosmosOriginated) : false,
    };
  },

  toJSON(message: ERC20ToDenomResponse): unknown {
    const obj: any = {};
    message.denom !== undefined && (obj.denom = message.denom);
    message.cosmosOriginated !== undefined && (obj.cosmosOriginated = message.cosmosOriginated);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<ERC20ToDenomResponse>, I>>(object: I): ERC20ToDenomResponse {
    const message = createBaseERC20ToDenomResponse();
    message.denom = object.denom ?? "";
    message.cosmosOriginated = object.cosmosOriginated ?? false;
    return message;
  },
};

function createBaseDenomToERC20ParamsRequest(): DenomToERC20ParamsRequest {
  return { denom: "" };
}

export const DenomToERC20ParamsRequest = {
  encode(message: DenomToERC20ParamsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.denom !== "") {
      writer.uint32(10).string(message.denom);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DenomToERC20ParamsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDenomToERC20ParamsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.denom = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): DenomToERC20ParamsRequest {
    return { denom: isSet(object.denom) ? String(object.denom) : "" };
  },

  toJSON(message: DenomToERC20ParamsRequest): unknown {
    const obj: any = {};
    message.denom !== undefined && (obj.denom = message.denom);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<DenomToERC20ParamsRequest>, I>>(object: I): DenomToERC20ParamsRequest {
    const message = createBaseDenomToERC20ParamsRequest();
    message.denom = object.denom ?? "";
    return message;
  },
};

function createBaseDenomToERC20ParamsResponse(): DenomToERC20ParamsResponse {
  return { baseDenom: "", erc20Name: "", erc20Symbol: "", erc20Decimals: 0 };
}

export const DenomToERC20ParamsResponse = {
  encode(message: DenomToERC20ParamsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.baseDenom !== "") {
      writer.uint32(10).string(message.baseDenom);
    }
    if (message.erc20Name !== "") {
      writer.uint32(18).string(message.erc20Name);
    }
    if (message.erc20Symbol !== "") {
      writer.uint32(26).string(message.erc20Symbol);
    }
    if (message.erc20Decimals !== 0) {
      writer.uint32(32).uint64(message.erc20Decimals);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DenomToERC20ParamsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDenomToERC20ParamsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.baseDenom = reader.string();
          break;
        case 2:
          message.erc20Name = reader.string();
          break;
        case 3:
          message.erc20Symbol = reader.string();
          break;
        case 4:
          message.erc20Decimals = longToNumber(reader.uint64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): DenomToERC20ParamsResponse {
    return {
      baseDenom: isSet(object.baseDenom) ? String(object.baseDenom) : "",
      erc20Name: isSet(object.erc20Name) ? String(object.erc20Name) : "",
      erc20Symbol: isSet(object.erc20Symbol) ? String(object.erc20Symbol) : "",
      erc20Decimals: isSet(object.erc20Decimals) ? Number(object.erc20Decimals) : 0,
    };
  },

  toJSON(message: DenomToERC20ParamsResponse): unknown {
    const obj: any = {};
    message.baseDenom !== undefined && (obj.baseDenom = message.baseDenom);
    message.erc20Name !== undefined && (obj.erc20Name = message.erc20Name);
    message.erc20Symbol !== undefined && (obj.erc20Symbol = message.erc20Symbol);
    message.erc20Decimals !== undefined && (obj.erc20Decimals = Math.round(message.erc20Decimals));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<DenomToERC20ParamsResponse>, I>>(object: I): DenomToERC20ParamsResponse {
    const message = createBaseDenomToERC20ParamsResponse();
    message.baseDenom = object.baseDenom ?? "";
    message.erc20Name = object.erc20Name ?? "";
    message.erc20Symbol = object.erc20Symbol ?? "";
    message.erc20Decimals = object.erc20Decimals ?? 0;
    return message;
  },
};

function createBaseDenomToERC20Request(): DenomToERC20Request {
  return { denom: "" };
}

export const DenomToERC20Request = {
  encode(message: DenomToERC20Request, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.denom !== "") {
      writer.uint32(10).string(message.denom);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DenomToERC20Request {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDenomToERC20Request();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.denom = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): DenomToERC20Request {
    return { denom: isSet(object.denom) ? String(object.denom) : "" };
  },

  toJSON(message: DenomToERC20Request): unknown {
    const obj: any = {};
    message.denom !== undefined && (obj.denom = message.denom);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<DenomToERC20Request>, I>>(object: I): DenomToERC20Request {
    const message = createBaseDenomToERC20Request();
    message.denom = object.denom ?? "";
    return message;
  },
};

function createBaseDenomToERC20Response(): DenomToERC20Response {
  return { erc20: "", cosmosOriginated: false };
}

export const DenomToERC20Response = {
  encode(message: DenomToERC20Response, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.erc20 !== "") {
      writer.uint32(10).string(message.erc20);
    }
    if (message.cosmosOriginated === true) {
      writer.uint32(16).bool(message.cosmosOriginated);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DenomToERC20Response {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDenomToERC20Response();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.erc20 = reader.string();
          break;
        case 2:
          message.cosmosOriginated = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): DenomToERC20Response {
    return {
      erc20: isSet(object.erc20) ? String(object.erc20) : "",
      cosmosOriginated: isSet(object.cosmosOriginated) ? Boolean(object.cosmosOriginated) : false,
    };
  },

  toJSON(message: DenomToERC20Response): unknown {
    const obj: any = {};
    message.erc20 !== undefined && (obj.erc20 = message.erc20);
    message.cosmosOriginated !== undefined && (obj.cosmosOriginated = message.cosmosOriginated);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<DenomToERC20Response>, I>>(object: I): DenomToERC20Response {
    const message = createBaseDenomToERC20Response();
    message.erc20 = object.erc20 ?? "";
    message.cosmosOriginated = object.cosmosOriginated ?? false;
    return message;
  },
};

function createBaseDelegateKeysByValidatorRequest(): DelegateKeysByValidatorRequest {
  return { validatorAddress: "" };
}

export const DelegateKeysByValidatorRequest = {
  encode(message: DelegateKeysByValidatorRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.validatorAddress !== "") {
      writer.uint32(10).string(message.validatorAddress);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DelegateKeysByValidatorRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDelegateKeysByValidatorRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.validatorAddress = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): DelegateKeysByValidatorRequest {
    return { validatorAddress: isSet(object.validatorAddress) ? String(object.validatorAddress) : "" };
  },

  toJSON(message: DelegateKeysByValidatorRequest): unknown {
    const obj: any = {};
    message.validatorAddress !== undefined && (obj.validatorAddress = message.validatorAddress);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<DelegateKeysByValidatorRequest>, I>>(
    object: I,
  ): DelegateKeysByValidatorRequest {
    const message = createBaseDelegateKeysByValidatorRequest();
    message.validatorAddress = object.validatorAddress ?? "";
    return message;
  },
};

function createBaseDelegateKeysByValidatorResponse(): DelegateKeysByValidatorResponse {
  return { ethAddress: "", orchestratorAddress: "" };
}

export const DelegateKeysByValidatorResponse = {
  encode(message: DelegateKeysByValidatorResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.ethAddress !== "") {
      writer.uint32(10).string(message.ethAddress);
    }
    if (message.orchestratorAddress !== "") {
      writer.uint32(18).string(message.orchestratorAddress);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DelegateKeysByValidatorResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDelegateKeysByValidatorResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.ethAddress = reader.string();
          break;
        case 2:
          message.orchestratorAddress = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): DelegateKeysByValidatorResponse {
    return {
      ethAddress: isSet(object.ethAddress) ? String(object.ethAddress) : "",
      orchestratorAddress: isSet(object.orchestratorAddress) ? String(object.orchestratorAddress) : "",
    };
  },

  toJSON(message: DelegateKeysByValidatorResponse): unknown {
    const obj: any = {};
    message.ethAddress !== undefined && (obj.ethAddress = message.ethAddress);
    message.orchestratorAddress !== undefined && (obj.orchestratorAddress = message.orchestratorAddress);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<DelegateKeysByValidatorResponse>, I>>(
    object: I,
  ): DelegateKeysByValidatorResponse {
    const message = createBaseDelegateKeysByValidatorResponse();
    message.ethAddress = object.ethAddress ?? "";
    message.orchestratorAddress = object.orchestratorAddress ?? "";
    return message;
  },
};

function createBaseDelegateKeysByEthereumSignerRequest(): DelegateKeysByEthereumSignerRequest {
  return { ethereumSigner: "" };
}

export const DelegateKeysByEthereumSignerRequest = {
  encode(message: DelegateKeysByEthereumSignerRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.ethereumSigner !== "") {
      writer.uint32(10).string(message.ethereumSigner);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DelegateKeysByEthereumSignerRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDelegateKeysByEthereumSignerRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.ethereumSigner = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): DelegateKeysByEthereumSignerRequest {
    return { ethereumSigner: isSet(object.ethereumSigner) ? String(object.ethereumSigner) : "" };
  },

  toJSON(message: DelegateKeysByEthereumSignerRequest): unknown {
    const obj: any = {};
    message.ethereumSigner !== undefined && (obj.ethereumSigner = message.ethereumSigner);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<DelegateKeysByEthereumSignerRequest>, I>>(
    object: I,
  ): DelegateKeysByEthereumSignerRequest {
    const message = createBaseDelegateKeysByEthereumSignerRequest();
    message.ethereumSigner = object.ethereumSigner ?? "";
    return message;
  },
};

function createBaseDelegateKeysByEthereumSignerResponse(): DelegateKeysByEthereumSignerResponse {
  return { validatorAddress: "", orchestratorAddress: "" };
}

export const DelegateKeysByEthereumSignerResponse = {
  encode(message: DelegateKeysByEthereumSignerResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.validatorAddress !== "") {
      writer.uint32(10).string(message.validatorAddress);
    }
    if (message.orchestratorAddress !== "") {
      writer.uint32(18).string(message.orchestratorAddress);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DelegateKeysByEthereumSignerResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDelegateKeysByEthereumSignerResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.validatorAddress = reader.string();
          break;
        case 2:
          message.orchestratorAddress = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): DelegateKeysByEthereumSignerResponse {
    return {
      validatorAddress: isSet(object.validatorAddress) ? String(object.validatorAddress) : "",
      orchestratorAddress: isSet(object.orchestratorAddress) ? String(object.orchestratorAddress) : "",
    };
  },

  toJSON(message: DelegateKeysByEthereumSignerResponse): unknown {
    const obj: any = {};
    message.validatorAddress !== undefined && (obj.validatorAddress = message.validatorAddress);
    message.orchestratorAddress !== undefined && (obj.orchestratorAddress = message.orchestratorAddress);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<DelegateKeysByEthereumSignerResponse>, I>>(
    object: I,
  ): DelegateKeysByEthereumSignerResponse {
    const message = createBaseDelegateKeysByEthereumSignerResponse();
    message.validatorAddress = object.validatorAddress ?? "";
    message.orchestratorAddress = object.orchestratorAddress ?? "";
    return message;
  },
};

function createBaseDelegateKeysByOrchestratorRequest(): DelegateKeysByOrchestratorRequest {
  return { orchestratorAddress: "" };
}

export const DelegateKeysByOrchestratorRequest = {
  encode(message: DelegateKeysByOrchestratorRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.orchestratorAddress !== "") {
      writer.uint32(10).string(message.orchestratorAddress);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DelegateKeysByOrchestratorRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDelegateKeysByOrchestratorRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.orchestratorAddress = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): DelegateKeysByOrchestratorRequest {
    return { orchestratorAddress: isSet(object.orchestratorAddress) ? String(object.orchestratorAddress) : "" };
  },

  toJSON(message: DelegateKeysByOrchestratorRequest): unknown {
    const obj: any = {};
    message.orchestratorAddress !== undefined && (obj.orchestratorAddress = message.orchestratorAddress);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<DelegateKeysByOrchestratorRequest>, I>>(
    object: I,
  ): DelegateKeysByOrchestratorRequest {
    const message = createBaseDelegateKeysByOrchestratorRequest();
    message.orchestratorAddress = object.orchestratorAddress ?? "";
    return message;
  },
};

function createBaseDelegateKeysByOrchestratorResponse(): DelegateKeysByOrchestratorResponse {
  return { validatorAddress: "", ethereumSigner: "" };
}

export const DelegateKeysByOrchestratorResponse = {
  encode(message: DelegateKeysByOrchestratorResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.validatorAddress !== "") {
      writer.uint32(10).string(message.validatorAddress);
    }
    if (message.ethereumSigner !== "") {
      writer.uint32(18).string(message.ethereumSigner);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DelegateKeysByOrchestratorResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDelegateKeysByOrchestratorResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.validatorAddress = reader.string();
          break;
        case 2:
          message.ethereumSigner = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): DelegateKeysByOrchestratorResponse {
    return {
      validatorAddress: isSet(object.validatorAddress) ? String(object.validatorAddress) : "",
      ethereumSigner: isSet(object.ethereumSigner) ? String(object.ethereumSigner) : "",
    };
  },

  toJSON(message: DelegateKeysByOrchestratorResponse): unknown {
    const obj: any = {};
    message.validatorAddress !== undefined && (obj.validatorAddress = message.validatorAddress);
    message.ethereumSigner !== undefined && (obj.ethereumSigner = message.ethereumSigner);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<DelegateKeysByOrchestratorResponse>, I>>(
    object: I,
  ): DelegateKeysByOrchestratorResponse {
    const message = createBaseDelegateKeysByOrchestratorResponse();
    message.validatorAddress = object.validatorAddress ?? "";
    message.ethereumSigner = object.ethereumSigner ?? "";
    return message;
  },
};

function createBaseDelegateKeysRequest(): DelegateKeysRequest {
  return {};
}

export const DelegateKeysRequest = {
  encode(_: DelegateKeysRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DelegateKeysRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDelegateKeysRequest();
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

  fromJSON(_: any): DelegateKeysRequest {
    return {};
  },

  toJSON(_: DelegateKeysRequest): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<DelegateKeysRequest>, I>>(_: I): DelegateKeysRequest {
    const message = createBaseDelegateKeysRequest();
    return message;
  },
};

function createBaseDelegateKeysResponse(): DelegateKeysResponse {
  return { delegateKeys: [] };
}

export const DelegateKeysResponse = {
  encode(message: DelegateKeysResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.delegateKeys) {
      MsgDelegateKeys.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DelegateKeysResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDelegateKeysResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.delegateKeys.push(MsgDelegateKeys.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): DelegateKeysResponse {
    return {
      delegateKeys: Array.isArray(object?.delegateKeys)
        ? object.delegateKeys.map((e: any) => MsgDelegateKeys.fromJSON(e))
        : [],
    };
  },

  toJSON(message: DelegateKeysResponse): unknown {
    const obj: any = {};
    if (message.delegateKeys) {
      obj.delegateKeys = message.delegateKeys.map((e) => e ? MsgDelegateKeys.toJSON(e) : undefined);
    } else {
      obj.delegateKeys = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<DelegateKeysResponse>, I>>(object: I): DelegateKeysResponse {
    const message = createBaseDelegateKeysResponse();
    message.delegateKeys = object.delegateKeys?.map((e) => MsgDelegateKeys.fromPartial(e)) || [];
    return message;
  },
};

function createBaseBatchedSendToEthereumsRequest(): BatchedSendToEthereumsRequest {
  return { senderAddress: "" };
}

export const BatchedSendToEthereumsRequest = {
  encode(message: BatchedSendToEthereumsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.senderAddress !== "") {
      writer.uint32(10).string(message.senderAddress);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): BatchedSendToEthereumsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBatchedSendToEthereumsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.senderAddress = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): BatchedSendToEthereumsRequest {
    return { senderAddress: isSet(object.senderAddress) ? String(object.senderAddress) : "" };
  },

  toJSON(message: BatchedSendToEthereumsRequest): unknown {
    const obj: any = {};
    message.senderAddress !== undefined && (obj.senderAddress = message.senderAddress);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<BatchedSendToEthereumsRequest>, I>>(
    object: I,
  ): BatchedSendToEthereumsRequest {
    const message = createBaseBatchedSendToEthereumsRequest();
    message.senderAddress = object.senderAddress ?? "";
    return message;
  },
};

function createBaseBatchedSendToEthereumsResponse(): BatchedSendToEthereumsResponse {
  return { sendToEthereums: [] };
}

export const BatchedSendToEthereumsResponse = {
  encode(message: BatchedSendToEthereumsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.sendToEthereums) {
      SendToEthereum.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): BatchedSendToEthereumsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBatchedSendToEthereumsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.sendToEthereums.push(SendToEthereum.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): BatchedSendToEthereumsResponse {
    return {
      sendToEthereums: Array.isArray(object?.sendToEthereums)
        ? object.sendToEthereums.map((e: any) => SendToEthereum.fromJSON(e))
        : [],
    };
  },

  toJSON(message: BatchedSendToEthereumsResponse): unknown {
    const obj: any = {};
    if (message.sendToEthereums) {
      obj.sendToEthereums = message.sendToEthereums.map((e) => e ? SendToEthereum.toJSON(e) : undefined);
    } else {
      obj.sendToEthereums = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<BatchedSendToEthereumsResponse>, I>>(
    object: I,
  ): BatchedSendToEthereumsResponse {
    const message = createBaseBatchedSendToEthereumsResponse();
    message.sendToEthereums = object.sendToEthereums?.map((e) => SendToEthereum.fromPartial(e)) || [];
    return message;
  },
};

function createBaseUnbatchedSendToEthereumsRequest(): UnbatchedSendToEthereumsRequest {
  return { senderAddress: "", pagination: undefined };
}

export const UnbatchedSendToEthereumsRequest = {
  encode(message: UnbatchedSendToEthereumsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.senderAddress !== "") {
      writer.uint32(10).string(message.senderAddress);
    }
    if (message.pagination !== undefined) {
      PageRequest.encode(message.pagination, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UnbatchedSendToEthereumsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUnbatchedSendToEthereumsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.senderAddress = reader.string();
          break;
        case 2:
          message.pagination = PageRequest.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): UnbatchedSendToEthereumsRequest {
    return {
      senderAddress: isSet(object.senderAddress) ? String(object.senderAddress) : "",
      pagination: isSet(object.pagination) ? PageRequest.fromJSON(object.pagination) : undefined,
    };
  },

  toJSON(message: UnbatchedSendToEthereumsRequest): unknown {
    const obj: any = {};
    message.senderAddress !== undefined && (obj.senderAddress = message.senderAddress);
    message.pagination !== undefined
      && (obj.pagination = message.pagination ? PageRequest.toJSON(message.pagination) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<UnbatchedSendToEthereumsRequest>, I>>(
    object: I,
  ): UnbatchedSendToEthereumsRequest {
    const message = createBaseUnbatchedSendToEthereumsRequest();
    message.senderAddress = object.senderAddress ?? "";
    message.pagination = (object.pagination !== undefined && object.pagination !== null)
      ? PageRequest.fromPartial(object.pagination)
      : undefined;
    return message;
  },
};

function createBaseUnbatchedSendToEthereumsResponse(): UnbatchedSendToEthereumsResponse {
  return { sendToEthereums: [], pagination: undefined };
}

export const UnbatchedSendToEthereumsResponse = {
  encode(message: UnbatchedSendToEthereumsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.sendToEthereums) {
      SendToEthereum.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.pagination !== undefined) {
      PageResponse.encode(message.pagination, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UnbatchedSendToEthereumsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUnbatchedSendToEthereumsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.sendToEthereums.push(SendToEthereum.decode(reader, reader.uint32()));
          break;
        case 2:
          message.pagination = PageResponse.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): UnbatchedSendToEthereumsResponse {
    return {
      sendToEthereums: Array.isArray(object?.sendToEthereums)
        ? object.sendToEthereums.map((e: any) => SendToEthereum.fromJSON(e))
        : [],
      pagination: isSet(object.pagination) ? PageResponse.fromJSON(object.pagination) : undefined,
    };
  },

  toJSON(message: UnbatchedSendToEthereumsResponse): unknown {
    const obj: any = {};
    if (message.sendToEthereums) {
      obj.sendToEthereums = message.sendToEthereums.map((e) => e ? SendToEthereum.toJSON(e) : undefined);
    } else {
      obj.sendToEthereums = [];
    }
    message.pagination !== undefined
      && (obj.pagination = message.pagination ? PageResponse.toJSON(message.pagination) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<UnbatchedSendToEthereumsResponse>, I>>(
    object: I,
  ): UnbatchedSendToEthereumsResponse {
    const message = createBaseUnbatchedSendToEthereumsResponse();
    message.sendToEthereums = object.sendToEthereums?.map((e) => SendToEthereum.fromPartial(e)) || [];
    message.pagination = (object.pagination !== undefined && object.pagination !== null)
      ? PageResponse.fromPartial(object.pagination)
      : undefined;
    return message;
  },
};

function createBaseLastObservedEthereumHeightRequest(): LastObservedEthereumHeightRequest {
  return {};
}

export const LastObservedEthereumHeightRequest = {
  encode(_: LastObservedEthereumHeightRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): LastObservedEthereumHeightRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLastObservedEthereumHeightRequest();
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

  fromJSON(_: any): LastObservedEthereumHeightRequest {
    return {};
  },

  toJSON(_: LastObservedEthereumHeightRequest): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<LastObservedEthereumHeightRequest>, I>>(
    _: I,
  ): LastObservedEthereumHeightRequest {
    const message = createBaseLastObservedEthereumHeightRequest();
    return message;
  },
};

function createBaseLastObservedEthereumHeightResponse(): LastObservedEthereumHeightResponse {
  return { lastObservedEthereumHeight: undefined };
}

export const LastObservedEthereumHeightResponse = {
  encode(message: LastObservedEthereumHeightResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.lastObservedEthereumHeight !== undefined) {
      LatestEthereumBlockHeight.encode(message.lastObservedEthereumHeight, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): LastObservedEthereumHeightResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLastObservedEthereumHeightResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.lastObservedEthereumHeight = LatestEthereumBlockHeight.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): LastObservedEthereumHeightResponse {
    return {
      lastObservedEthereumHeight: isSet(object.lastObservedEthereumHeight)
        ? LatestEthereumBlockHeight.fromJSON(object.lastObservedEthereumHeight)
        : undefined,
    };
  },

  toJSON(message: LastObservedEthereumHeightResponse): unknown {
    const obj: any = {};
    message.lastObservedEthereumHeight !== undefined
      && (obj.lastObservedEthereumHeight = message.lastObservedEthereumHeight
        ? LatestEthereumBlockHeight.toJSON(message.lastObservedEthereumHeight)
        : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<LastObservedEthereumHeightResponse>, I>>(
    object: I,
  ): LastObservedEthereumHeightResponse {
    const message = createBaseLastObservedEthereumHeightResponse();
    message.lastObservedEthereumHeight =
      (object.lastObservedEthereumHeight !== undefined && object.lastObservedEthereumHeight !== null)
        ? LatestEthereumBlockHeight.fromPartial(object.lastObservedEthereumHeight)
        : undefined;
    return message;
  },
};

/** Query defines the gRPC querier service */
export interface Query {
  /** Module parameters query */
  Params(request: ParamsRequest): Promise<ParamsResponse>;
  /** get info on individual outgoing data */
  SignerSetTx(request: SignerSetTxRequest): Promise<SignerSetTxResponse>;
  /** option (google.api.http).get = "/gravity/v1/signer_set/latest"; */
  LatestSignerSetTx(request: LatestSignerSetTxRequest): Promise<SignerSetTxResponse>;
  /**
   * option (google.api.http).get =
   * "/gravity/v1/batch_txs/{token_contract}/{nonce}";
   */
  BatchTx(request: BatchTxRequest): Promise<BatchTxResponse>;
  /**
   * option (google.api.http).get =
   * "/gravity/v1/contract_call_txs/{invalidation_id}/{invalidation_nonce}";
   */
  ContractCallTx(request: ContractCallTxRequest): Promise<ContractCallTxResponse>;
  /** get collections of outgoing traffic from the bridge */
  SignerSetTxs(request: SignerSetTxsRequest): Promise<SignerSetTxsResponse>;
  /** option (google.api.http).get = "/gravity/v1/batch/batch_txs"; */
  BatchTxs(request: BatchTxsRequest): Promise<BatchTxsResponse>;
  /** option (google.api.http).get = "/gravity/v1/batch/contract_call_txs"; */
  ContractCallTxs(request: ContractCallTxsRequest): Promise<ContractCallTxsResponse>;
  /** TODO: can/should we group these into one endpoint? */
  SignerSetTxConfirmations(request: SignerSetTxConfirmationsRequest): Promise<SignerSetTxConfirmationsResponse>;
  /**
   * option (google.api.http).get =
   * "/gravity/v1/batch_txs/ethereum_signatures";
   */
  BatchTxConfirmations(request: BatchTxConfirmationsRequest): Promise<BatchTxConfirmationsResponse>;
  /**
   * option (google.api.http).get =
   * "/gravity/v1/logic_calls/ethereum_signatures";
   */
  ContractCallTxConfirmations(
    request: ContractCallTxConfirmationsRequest,
  ): Promise<ContractCallTxConfirmationsResponse>;
  /**
   * pending ethereum signature queries for orchestrators to figure out which
   * signatures they are missing
   * TODO: can/should we group this into one endpoint?
   */
  UnsignedSignerSetTxs(request: UnsignedSignerSetTxsRequest): Promise<UnsignedSignerSetTxsResponse>;
  /** option (google.api.http).get = "/gravity/v1/batches/{address}/pending"; */
  UnsignedBatchTxs(request: UnsignedBatchTxsRequest): Promise<UnsignedBatchTxsResponse>;
  /**
   * option (google.api.http).get =
   * "/gravity/v1/ContractCallTxs/{address}/pending";
   */
  UnsignedContractCallTxs(request: UnsignedContractCallTxsRequest): Promise<UnsignedContractCallTxsResponse>;
  /**
   * option (google.api.http).get =
   * "/gravity/v1/oracle/event_nonce/{address}";
   */
  LastSubmittedEthereumEvent(request: LastSubmittedEthereumEventRequest): Promise<LastSubmittedEthereumEventResponse>;
  /**
   * Queries the fees for all pending batches, results are returned in sdk.Coin
   * (fee_amount_int)(contract_address) style
   */
  BatchTxFees(request: BatchTxFeesRequest): Promise<BatchTxFeesResponse>;
  /** Query for info about denoms tracked by gravity */
  ERC20ToDenom(request: ERC20ToDenomRequest): Promise<ERC20ToDenomResponse>;
  /**
   * DenomToERC20Params implements a query that allows ERC-20 parameter
   * information to be retrieved by a Cosmos base denomination.
   */
  DenomToERC20Params(request: DenomToERC20ParamsRequest): Promise<DenomToERC20ParamsResponse>;
  /** Query for info about denoms tracked by gravity */
  DenomToERC20(request: DenomToERC20Request): Promise<DenomToERC20Response>;
  /** Query for batch send to ethereums */
  BatchedSendToEthereums(request: BatchedSendToEthereumsRequest): Promise<BatchedSendToEthereumsResponse>;
  /** Query for unbatched send to ethereums */
  UnbatchedSendToEthereums(request: UnbatchedSendToEthereumsRequest): Promise<UnbatchedSendToEthereumsResponse>;
  /** delegate keys */
  DelegateKeysByValidator(request: DelegateKeysByValidatorRequest): Promise<DelegateKeysByValidatorResponse>;
  /**
   * option (google.api.http).get =
   * "/gravity/v1/delegate_keys/ethereum/{ethereum_signer}";
   */
  DelegateKeysByEthereumSigner(
    request: DelegateKeysByEthereumSignerRequest,
  ): Promise<DelegateKeysByEthereumSignerResponse>;
  /**
   * option (google.api.http).get =
   * "/gravity/v1/delegate_keys/orchestrator/{orchestrator}";
   */
  DelegateKeysByOrchestrator(request: DelegateKeysByOrchestratorRequest): Promise<DelegateKeysByOrchestratorResponse>;
  /**
   * option (google.api.http).get =
   * "/gravity/v1/delegate_keys";
   */
  DelegateKeys(request: DelegateKeysRequest): Promise<DelegateKeysResponse>;
  /**
   * option (google.api.http).get =
   * "/gravity/v1/last_observed_ethereum_height"
   */
  LastObservedEthereumHeight(request: LastObservedEthereumHeightRequest): Promise<LastObservedEthereumHeightResponse>;
}

export class QueryClientImpl implements Query {
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.Params = this.Params.bind(this);
    this.SignerSetTx = this.SignerSetTx.bind(this);
    this.LatestSignerSetTx = this.LatestSignerSetTx.bind(this);
    this.BatchTx = this.BatchTx.bind(this);
    this.ContractCallTx = this.ContractCallTx.bind(this);
    this.SignerSetTxs = this.SignerSetTxs.bind(this);
    this.BatchTxs = this.BatchTxs.bind(this);
    this.ContractCallTxs = this.ContractCallTxs.bind(this);
    this.SignerSetTxConfirmations = this.SignerSetTxConfirmations.bind(this);
    this.BatchTxConfirmations = this.BatchTxConfirmations.bind(this);
    this.ContractCallTxConfirmations = this.ContractCallTxConfirmations.bind(this);
    this.UnsignedSignerSetTxs = this.UnsignedSignerSetTxs.bind(this);
    this.UnsignedBatchTxs = this.UnsignedBatchTxs.bind(this);
    this.UnsignedContractCallTxs = this.UnsignedContractCallTxs.bind(this);
    this.LastSubmittedEthereumEvent = this.LastSubmittedEthereumEvent.bind(this);
    this.BatchTxFees = this.BatchTxFees.bind(this);
    this.ERC20ToDenom = this.ERC20ToDenom.bind(this);
    this.DenomToERC20Params = this.DenomToERC20Params.bind(this);
    this.DenomToERC20 = this.DenomToERC20.bind(this);
    this.BatchedSendToEthereums = this.BatchedSendToEthereums.bind(this);
    this.UnbatchedSendToEthereums = this.UnbatchedSendToEthereums.bind(this);
    this.DelegateKeysByValidator = this.DelegateKeysByValidator.bind(this);
    this.DelegateKeysByEthereumSigner = this.DelegateKeysByEthereumSigner.bind(this);
    this.DelegateKeysByOrchestrator = this.DelegateKeysByOrchestrator.bind(this);
    this.DelegateKeys = this.DelegateKeys.bind(this);
    this.LastObservedEthereumHeight = this.LastObservedEthereumHeight.bind(this);
  }
  Params(request: ParamsRequest): Promise<ParamsResponse> {
    const data = ParamsRequest.encode(request).finish();
    const promise = this.rpc.request("gravity.v1.Query", "Params", data);
    return promise.then((data) => ParamsResponse.decode(new _m0.Reader(data)));
  }

  SignerSetTx(request: SignerSetTxRequest): Promise<SignerSetTxResponse> {
    const data = SignerSetTxRequest.encode(request).finish();
    const promise = this.rpc.request("gravity.v1.Query", "SignerSetTx", data);
    return promise.then((data) => SignerSetTxResponse.decode(new _m0.Reader(data)));
  }

  LatestSignerSetTx(request: LatestSignerSetTxRequest): Promise<SignerSetTxResponse> {
    const data = LatestSignerSetTxRequest.encode(request).finish();
    const promise = this.rpc.request("gravity.v1.Query", "LatestSignerSetTx", data);
    return promise.then((data) => SignerSetTxResponse.decode(new _m0.Reader(data)));
  }

  BatchTx(request: BatchTxRequest): Promise<BatchTxResponse> {
    const data = BatchTxRequest.encode(request).finish();
    const promise = this.rpc.request("gravity.v1.Query", "BatchTx", data);
    return promise.then((data) => BatchTxResponse.decode(new _m0.Reader(data)));
  }

  ContractCallTx(request: ContractCallTxRequest): Promise<ContractCallTxResponse> {
    const data = ContractCallTxRequest.encode(request).finish();
    const promise = this.rpc.request("gravity.v1.Query", "ContractCallTx", data);
    return promise.then((data) => ContractCallTxResponse.decode(new _m0.Reader(data)));
  }

  SignerSetTxs(request: SignerSetTxsRequest): Promise<SignerSetTxsResponse> {
    const data = SignerSetTxsRequest.encode(request).finish();
    const promise = this.rpc.request("gravity.v1.Query", "SignerSetTxs", data);
    return promise.then((data) => SignerSetTxsResponse.decode(new _m0.Reader(data)));
  }

  BatchTxs(request: BatchTxsRequest): Promise<BatchTxsResponse> {
    const data = BatchTxsRequest.encode(request).finish();
    const promise = this.rpc.request("gravity.v1.Query", "BatchTxs", data);
    return promise.then((data) => BatchTxsResponse.decode(new _m0.Reader(data)));
  }

  ContractCallTxs(request: ContractCallTxsRequest): Promise<ContractCallTxsResponse> {
    const data = ContractCallTxsRequest.encode(request).finish();
    const promise = this.rpc.request("gravity.v1.Query", "ContractCallTxs", data);
    return promise.then((data) => ContractCallTxsResponse.decode(new _m0.Reader(data)));
  }

  SignerSetTxConfirmations(request: SignerSetTxConfirmationsRequest): Promise<SignerSetTxConfirmationsResponse> {
    const data = SignerSetTxConfirmationsRequest.encode(request).finish();
    const promise = this.rpc.request("gravity.v1.Query", "SignerSetTxConfirmations", data);
    return promise.then((data) => SignerSetTxConfirmationsResponse.decode(new _m0.Reader(data)));
  }

  BatchTxConfirmations(request: BatchTxConfirmationsRequest): Promise<BatchTxConfirmationsResponse> {
    const data = BatchTxConfirmationsRequest.encode(request).finish();
    const promise = this.rpc.request("gravity.v1.Query", "BatchTxConfirmations", data);
    return promise.then((data) => BatchTxConfirmationsResponse.decode(new _m0.Reader(data)));
  }

  ContractCallTxConfirmations(
    request: ContractCallTxConfirmationsRequest,
  ): Promise<ContractCallTxConfirmationsResponse> {
    const data = ContractCallTxConfirmationsRequest.encode(request).finish();
    const promise = this.rpc.request("gravity.v1.Query", "ContractCallTxConfirmations", data);
    return promise.then((data) => ContractCallTxConfirmationsResponse.decode(new _m0.Reader(data)));
  }

  UnsignedSignerSetTxs(request: UnsignedSignerSetTxsRequest): Promise<UnsignedSignerSetTxsResponse> {
    const data = UnsignedSignerSetTxsRequest.encode(request).finish();
    const promise = this.rpc.request("gravity.v1.Query", "UnsignedSignerSetTxs", data);
    return promise.then((data) => UnsignedSignerSetTxsResponse.decode(new _m0.Reader(data)));
  }

  UnsignedBatchTxs(request: UnsignedBatchTxsRequest): Promise<UnsignedBatchTxsResponse> {
    const data = UnsignedBatchTxsRequest.encode(request).finish();
    const promise = this.rpc.request("gravity.v1.Query", "UnsignedBatchTxs", data);
    return promise.then((data) => UnsignedBatchTxsResponse.decode(new _m0.Reader(data)));
  }

  UnsignedContractCallTxs(request: UnsignedContractCallTxsRequest): Promise<UnsignedContractCallTxsResponse> {
    const data = UnsignedContractCallTxsRequest.encode(request).finish();
    const promise = this.rpc.request("gravity.v1.Query", "UnsignedContractCallTxs", data);
    return promise.then((data) => UnsignedContractCallTxsResponse.decode(new _m0.Reader(data)));
  }

  LastSubmittedEthereumEvent(request: LastSubmittedEthereumEventRequest): Promise<LastSubmittedEthereumEventResponse> {
    const data = LastSubmittedEthereumEventRequest.encode(request).finish();
    const promise = this.rpc.request("gravity.v1.Query", "LastSubmittedEthereumEvent", data);
    return promise.then((data) => LastSubmittedEthereumEventResponse.decode(new _m0.Reader(data)));
  }

  BatchTxFees(request: BatchTxFeesRequest): Promise<BatchTxFeesResponse> {
    const data = BatchTxFeesRequest.encode(request).finish();
    const promise = this.rpc.request("gravity.v1.Query", "BatchTxFees", data);
    return promise.then((data) => BatchTxFeesResponse.decode(new _m0.Reader(data)));
  }

  ERC20ToDenom(request: ERC20ToDenomRequest): Promise<ERC20ToDenomResponse> {
    const data = ERC20ToDenomRequest.encode(request).finish();
    const promise = this.rpc.request("gravity.v1.Query", "ERC20ToDenom", data);
    return promise.then((data) => ERC20ToDenomResponse.decode(new _m0.Reader(data)));
  }

  DenomToERC20Params(request: DenomToERC20ParamsRequest): Promise<DenomToERC20ParamsResponse> {
    const data = DenomToERC20ParamsRequest.encode(request).finish();
    const promise = this.rpc.request("gravity.v1.Query", "DenomToERC20Params", data);
    return promise.then((data) => DenomToERC20ParamsResponse.decode(new _m0.Reader(data)));
  }

  DenomToERC20(request: DenomToERC20Request): Promise<DenomToERC20Response> {
    const data = DenomToERC20Request.encode(request).finish();
    const promise = this.rpc.request("gravity.v1.Query", "DenomToERC20", data);
    return promise.then((data) => DenomToERC20Response.decode(new _m0.Reader(data)));
  }

  BatchedSendToEthereums(request: BatchedSendToEthereumsRequest): Promise<BatchedSendToEthereumsResponse> {
    const data = BatchedSendToEthereumsRequest.encode(request).finish();
    const promise = this.rpc.request("gravity.v1.Query", "BatchedSendToEthereums", data);
    return promise.then((data) => BatchedSendToEthereumsResponse.decode(new _m0.Reader(data)));
  }

  UnbatchedSendToEthereums(request: UnbatchedSendToEthereumsRequest): Promise<UnbatchedSendToEthereumsResponse> {
    const data = UnbatchedSendToEthereumsRequest.encode(request).finish();
    const promise = this.rpc.request("gravity.v1.Query", "UnbatchedSendToEthereums", data);
    return promise.then((data) => UnbatchedSendToEthereumsResponse.decode(new _m0.Reader(data)));
  }

  DelegateKeysByValidator(request: DelegateKeysByValidatorRequest): Promise<DelegateKeysByValidatorResponse> {
    const data = DelegateKeysByValidatorRequest.encode(request).finish();
    const promise = this.rpc.request("gravity.v1.Query", "DelegateKeysByValidator", data);
    return promise.then((data) => DelegateKeysByValidatorResponse.decode(new _m0.Reader(data)));
  }

  DelegateKeysByEthereumSigner(
    request: DelegateKeysByEthereumSignerRequest,
  ): Promise<DelegateKeysByEthereumSignerResponse> {
    const data = DelegateKeysByEthereumSignerRequest.encode(request).finish();
    const promise = this.rpc.request("gravity.v1.Query", "DelegateKeysByEthereumSigner", data);
    return promise.then((data) => DelegateKeysByEthereumSignerResponse.decode(new _m0.Reader(data)));
  }

  DelegateKeysByOrchestrator(request: DelegateKeysByOrchestratorRequest): Promise<DelegateKeysByOrchestratorResponse> {
    const data = DelegateKeysByOrchestratorRequest.encode(request).finish();
    const promise = this.rpc.request("gravity.v1.Query", "DelegateKeysByOrchestrator", data);
    return promise.then((data) => DelegateKeysByOrchestratorResponse.decode(new _m0.Reader(data)));
  }

  DelegateKeys(request: DelegateKeysRequest): Promise<DelegateKeysResponse> {
    const data = DelegateKeysRequest.encode(request).finish();
    const promise = this.rpc.request("gravity.v1.Query", "DelegateKeys", data);
    return promise.then((data) => DelegateKeysResponse.decode(new _m0.Reader(data)));
  }

  LastObservedEthereumHeight(request: LastObservedEthereumHeightRequest): Promise<LastObservedEthereumHeightResponse> {
    const data = LastObservedEthereumHeightRequest.encode(request).finish();
    const promise = this.rpc.request("gravity.v1.Query", "LastObservedEthereumHeight", data);
    return promise.then((data) => LastObservedEthereumHeightResponse.decode(new _m0.Reader(data)));
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
