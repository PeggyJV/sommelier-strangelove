// @ts-nocheck
/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

/**
* `Any` contains an arbitrary serialized protocol buffer message along with a
URL that describes the type of the serialized message.

Protobuf library provides support to pack/unpack Any values in the form
of utility functions or additional generated methods of the Any type.

Example 1: Pack and unpack a message in C++.

    Foo foo = ...;
    Any any;
    any.PackFrom(foo);
    ...
    if (any.UnpackTo(&foo)) {
      ...
    }

Example 2: Pack and unpack a message in Java.

    Foo foo = ...;
    Any any = Any.pack(foo);
    ...
    if (any.is(Foo.class)) {
      foo = any.unpack(Foo.class);
    }

 Example 3: Pack and unpack a message in Python.

    foo = Foo(...)
    any = Any()
    any.Pack(foo)
    ...
    if any.Is(Foo.DESCRIPTOR):
      any.Unpack(foo)
      ...

 Example 4: Pack and unpack a message in Go

     foo := &pb.Foo{...}
     any, err := anypb.New(foo)
     if err != nil {
       ...
     }
     ...
     foo := &pb.Foo{}
     if err := any.UnmarshalTo(foo); err != nil {
       ...
     }

The pack methods provided by protobuf library will by default use
'type.googleapis.com/full.type.name' as the type URL and the unpack
methods only use the fully qualified type name after the last '/'
in the type URL, for example "foo.bar.com/x/y.z" will yield type
name "y.z".


JSON
====
The JSON representation of an `Any` value uses the regular
representation of the deserialized, embedded message, with an
additional field `@type` which contains the type URL. Example:

    package google.profile;
    message Person {
      string first_name = 1;
      string last_name = 2;
    }

    {
      "@type": "type.googleapis.com/google.profile.Person",
      "firstName": <string>,
      "lastName": <string>
    }

If the embedded message type is well-known and has a custom JSON
representation, that representation will be embedded adding a field
`value` which holds the custom JSON in addition to the `@type`
field. Example (for message [google.protobuf.Duration][]):

    {
      "@type": "type.googleapis.com/google.protobuf.Duration",
      "value": "1.212s"
    }
*/
export interface ProtobufAny {
  /**
   * A URL/resource name that uniquely identifies the type of the serialized
   * protocol buffer message. This string must contain at least
   * one "/" character. The last segment of the URL's path must represent
   * the fully qualified name of the type (as in
   * `path/google.protobuf.Duration`). The name should be in a canonical form
   * (e.g., leading "." is not accepted).
   *
   * In practice, teams usually precompile into the binary all types that they
   * expect it to use in the context of Any. However, for URLs which use the
   * scheme `http`, `https`, or no scheme, one can optionally set up a type
   * server that maps type URLs to message definitions as follows:
   * * If no scheme is provided, `https` is assumed.
   * * An HTTP GET on the URL must yield a [google.protobuf.Type][]
   *   value in binary format, or produce an error.
   * * Applications are allowed to cache lookup results based on the
   *   URL, or have them precompiled into a binary to avoid any
   *   lookup. Therefore, binary compatibility needs to be preserved
   *   on changes to types. (Use versioned type names to manage
   *   breaking changes.)
   * Note: this functionality is not currently available in the official
   * protobuf release, and it is not used for type URLs beginning with
   * type.googleapis.com.
   * Schemes other than `http`, `https` (or the empty scheme) might be
   * used with implementation specific semantics.
   */
  "@type"?: string
}

export interface RpcStatus {
  /** @format int32 */
  code?: number
  message?: string
  details?: ProtobufAny[]
}

export interface V1BatchTx {
  /** @format uint64 */
  batch_nonce?: string

  /** @format uint64 */
  timeout?: string
  transactions?: V1SendToEthereum[]
  token_contract?: string

  /** @format uint64 */
  height?: string
}

/**
 * BatchTxConfirmation is a signature on behalf of a validator for a BatchTx.
 */
export interface V1BatchTxConfirmation {
  token_contract?: string

  /** @format uint64 */
  batch_nonce?: string
  ethereum_signer?: string

  /** @format byte */
  signature?: string
}

export interface V1BatchTxConfirmationsResponse {
  signatures?: V1BatchTxConfirmation[]
}

export interface V1BatchTxFeesResponse {
  fees?: V1Beta1Coin[]
}

export interface V1BatchTxResponse {
  batch?: V1BatchTx
}

export interface V1BatchTxsResponse {
  batches?: V1BatchTx[]

  /**
   * PageResponse is to be embedded in gRPC response messages where the
   * corresponding request message has used PageRequest.
   *
   *  message SomeResponse {
   *          repeated Bar results = 1;
   *          PageResponse page = 2;
   *  }
   */
  pagination?: V1Beta1PageResponse
}

export interface V1BatchedSendToEthereumsResponse {
  /** cosmos.base.query.v1beta1.PageResponse pagination = 2; */
  send_to_ethereums?: V1SendToEthereum[]
}

/**
* ContractCallTx represents an individual arbitrary logic call transaction
from Cosmos to Ethereum.
*/
export interface V1ContractCallTx {
  /** @format uint64 */
  invalidation_nonce?: string

  /** @format byte */
  invalidation_scope?: string
  address?: string

  /** @format byte */
  payload?: string

  /** @format uint64 */
  timeout?: string
  tokens?: V1ERC20Token[]
  fees?: V1ERC20Token[]

  /** @format uint64 */
  height?: string
}

/**
* ContractCallTxConfirmation is a signature on behalf of a validator for a
ContractCallTx.
*/
export interface V1ContractCallTxConfirmation {
  /** @format byte */
  invalidation_scope?: string

  /** @format uint64 */
  invalidation_nonce?: string
  ethereum_signer?: string

  /** @format byte */
  signature?: string
}

export interface V1ContractCallTxConfirmationsResponse {
  signatures?: V1ContractCallTxConfirmation[]
}

export interface V1ContractCallTxResponse {
  /**
   * ContractCallTx represents an individual arbitrary logic call transaction
   * from Cosmos to Ethereum.
   */
  logic_call?: V1ContractCallTx
}

export interface V1ContractCallTxsResponse {
  calls?: V1ContractCallTx[]

  /**
   * PageResponse is to be embedded in gRPC response messages where the
   * corresponding request message has used PageRequest.
   *
   *  message SomeResponse {
   *          repeated Bar results = 1;
   *          PageResponse page = 2;
   *  }
   */
  pagination?: V1Beta1PageResponse
}

export interface V1DelegateKeysByEthereumSignerResponse {
  validator_address?: string
  orchestrator_address?: string
}

export interface V1DelegateKeysByOrchestratorResponse {
  validator_address?: string
  ethereum_signer?: string
}

export interface V1DelegateKeysByValidatorResponse {
  eth_address?: string
  orchestrator_address?: string
}

export interface V1DelegateKeysResponse {
  delegate_keys?: V1MsgDelegateKeys[]
}

export interface V1DenomToERC20ParamsResponse {
  base_denom?: string
  erc20_name?: string
  erc20_symbol?: string

  /** @format uint64 */
  erc20_decimals?: string
}

export interface V1DenomToERC20Response {
  erc20?: string
  cosmos_originated?: boolean
}

export interface V1ERC20ToDenomResponse {
  denom?: string
  cosmos_originated?: boolean
}

export interface V1ERC20Token {
  contract?: string
  amount?: string
}

/**
* EthereumSigner represents a cosmos validator with its corresponding bridge
operator ethereum address and its staking consensus power.
*/
export interface V1EthereumSigner {
  /** @format uint64 */
  power?: string
  ethereum_address?: string
}

export interface V1LastObservedEthereumHeightResponse {
  /**
   * LatestEthereumBlockHeight defines the latest observed ethereum block height
   * and the corresponding timestamp value in nanoseconds.
   */
  last_observed_ethereum_height?: V1LatestEthereumBlockHeight
}

export interface V1LastSubmittedEthereumEventResponse {
  /** @format uint64 */
  event_nonce?: string
}

/**
* LatestEthereumBlockHeight defines the latest observed ethereum block height
and the corresponding timestamp value in nanoseconds.
*/
export interface V1LatestEthereumBlockHeight {
  /** @format uint64 */
  ethereum_height?: string

  /** @format uint64 */
  cosmos_height?: string
}

export type V1MsgCancelSendToEthereumResponse = object

/**
* MsgDelegateKey allows validators to delegate their voting responsibilities
to a given orchestrator address. This key is then used as an optional
authentication method for attesting events from Ethereum.
*/
export interface V1MsgDelegateKeys {
  validator_address?: string
  orchestrator_address?: string
  ethereum_address?: string

  /** @format byte */
  eth_signature?: string
}

export type V1MsgDelegateKeysResponse = object

export type V1MsgEthereumHeightVoteResponse = object

export type V1MsgRequestBatchTxResponse = object

/**
* MsgSendToEthereumResponse returns the SendToEthereum transaction ID which
will be included in the batch tx.
*/
export interface V1MsgSendToEthereumResponse {
  /** @format uint64 */
  id?: string
}

export type V1MsgSubmitEthereumEventResponse = object

export type V1MsgSubmitEthereumTxConfirmationResponse = object

/**
* contract_hash:
the code hash of a known good version of the Gravity contract
solidity code. This can be used to verify the correct version
of the contract has been deployed. This is a reference value for
goernance action only it is never read by any Gravity code

bridge_ethereum_address:
is address of the bridge contract on the Ethereum side, this is a
reference value for governance only and is not actually used by any
Gravity code

bridge_chain_id:
the unique identifier of the Ethereum chain, this is a reference value
only and is not actually used by any Gravity code

These reference values may be used by future Gravity client implemetnations
to allow for saftey features or convenience features like the Gravity address
in your relayer. A relayer would require a configured Gravity address if
governance had not set the address on the chain it was relaying for.

signed_signer_set_txs_window
signed_batches_window
signed_ethereum_signatures_window

These values represent the time in blocks that a validator has to submit
a signature for a batch or valset, or to submit a ethereum_signature for a
particular attestation nonce. In the case of attestations this clock starts
when the attestation is created, but only allows for slashing once the event
has passed

target_eth_tx_timeout:

This is the 'target' value for when ethereum transactions time out, this is a
target because Ethereum is a probabilistic chain and you can't say for sure
what the block frequency is ahead of time.

average_block_time
average_ethereum_block_time

These values are the average Cosmos block time and Ethereum block time
respectively and they are used to compute what the target batch timeout is.
It is important that governance updates these in case of any major, prolonged
change in the time it takes to produce a block

slash_fraction_signer_set_tx
slash_fraction_batch
slash_fraction_ethereum_signature
slash_fraction_conflicting_ethereum_signature

The slashing fractions for the various gravity related slashing conditions.
The first three refer to not submitting a particular message, the third for
submitting a different ethereum_signature for the same Ethereum event
*/
export interface V1Params {
  gravity_id?: string
  contract_source_hash?: string
  bridge_ethereum_address?: string

  /** @format uint64 */
  bridge_chain_id?: string

  /** @format uint64 */
  signed_signer_set_txs_window?: string

  /** @format uint64 */
  signed_batches_window?: string

  /** @format uint64 */
  ethereum_signatures_window?: string

  /** @format uint64 */
  target_eth_tx_timeout?: string

  /** @format uint64 */
  average_block_time?: string

  /** @format uint64 */
  average_ethereum_block_time?: string

  /**
   * TODO: slash fraction for contract call txs too
   * @format byte
   */
  slash_fraction_signer_set_tx?: string

  /** @format byte */
  slash_fraction_batch?: string

  /** @format byte */
  slash_fraction_ethereum_signature?: string

  /** @format byte */
  slash_fraction_conflicting_ethereum_signature?: string

  /** @format uint64 */
  unbond_slashing_signer_set_txs_window?: string
}

export interface V1ParamsResponse {
  /**
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
   * bridge_chain_id:
   * the unique identifier of the Ethereum chain, this is a reference value
   * only and is not actually used by any Gravity code
   * These reference values may be used by future Gravity client implemetnations
   * to allow for saftey features or convenience features like the Gravity address
   * in your relayer. A relayer would require a configured Gravity address if
   * governance had not set the address on the chain it was relaying for.
   * signed_signer_set_txs_window
   * signed_batches_window
   * signed_ethereum_signatures_window
   * These values represent the time in blocks that a validator has to submit
   * a signature for a batch or valset, or to submit a ethereum_signature for a
   * particular attestation nonce. In the case of attestations this clock starts
   * when the attestation is created, but only allows for slashing once the event
   * has passed
   * target_eth_tx_timeout:
   * This is the 'target' value for when ethereum transactions time out, this is a
   * target because Ethereum is a probabilistic chain and you can't say for sure
   * what the block frequency is ahead of time.
   * average_block_time
   * average_ethereum_block_time
   * These values are the average Cosmos block time and Ethereum block time
   * respectively and they are used to compute what the target batch timeout is.
   * It is important that governance updates these in case of any major, prolonged
   * change in the time it takes to produce a block
   * slash_fraction_signer_set_tx
   * slash_fraction_batch
   * slash_fraction_ethereum_signature
   * slash_fraction_conflicting_ethereum_signature
   * The slashing fractions for the various gravity related slashing conditions.
   * The first three refer to not submitting a particular message, the third for
   * submitting a different ethereum_signature for the same Ethereum event
   */
  params?: V1Params
}

export interface V1SendToEthereum {
  /** @format uint64 */
  id?: string
  sender?: string
  ethereum_recipient?: string
  erc20_token?: V1ERC20Token
  erc20_fee?: V1ERC20Token
}

/**
* SignerSetTx is the Ethereum Bridge multisig set that relays
transactions the two chains. The staking validators keep ethereum keys which
are used to check signatures on Ethereum in order to get significant gas
savings.
*/
export interface V1SignerSetTx {
  /** @format uint64 */
  nonce?: string

  /** @format uint64 */
  height?: string
  signers?: V1EthereumSigner[]
}

export interface V1SignerSetTxConfirmation {
  /** @format uint64 */
  signer_set_nonce?: string
  ethereum_signer?: string

  /** @format byte */
  signature?: string
}

export interface V1SignerSetTxConfirmationsResponse {
  signatures?: V1SignerSetTxConfirmation[]
}

export interface V1SignerSetTxResponse {
  /**
   * SignerSetTx is the Ethereum Bridge multisig set that relays
   * transactions the two chains. The staking validators keep ethereum keys which
   * are used to check signatures on Ethereum in order to get significant gas
   * savings.
   */
  signer_set?: V1SignerSetTx
}

export interface V1SignerSetTxsResponse {
  signer_sets?: V1SignerSetTx[]

  /**
   * PageResponse is to be embedded in gRPC response messages where the
   * corresponding request message has used PageRequest.
   *
   *  message SomeResponse {
   *          repeated Bar results = 1;
   *          PageResponse page = 2;
   *  }
   */
  pagination?: V1Beta1PageResponse
}

export interface V1UnbatchedSendToEthereumsResponse {
  send_to_ethereums?: V1SendToEthereum[]

  /**
   * PageResponse is to be embedded in gRPC response messages where the
   * corresponding request message has used PageRequest.
   *
   *  message SomeResponse {
   *          repeated Bar results = 1;
   *          PageResponse page = 2;
   *  }
   */
  pagination?: V1Beta1PageResponse
}

export interface V1UnsignedBatchTxsResponse {
  /** Note these are returned with the signature empty */
  batches?: V1BatchTx[]
}

export interface V1UnsignedContractCallTxsResponse {
  calls?: V1ContractCallTx[]
}

export interface V1UnsignedSignerSetTxsResponse {
  signer_sets?: V1SignerSetTx[]
}

/**
* Coin defines a token with a denomination and an amount.

NOTE: The amount field is an Int which implements the custom method
signatures required by gogoproto.
*/
export interface V1Beta1Coin {
  denom?: string
  amount?: string
}

/**
* message SomeRequest {
         Foo some_parameter = 1;
         PageRequest pagination = 2;
 }
*/
export interface V1Beta1PageRequest {
  /**
   * key is a value returned in PageResponse.next_key to begin
   * querying the next page most efficiently. Only one of offset or key
   * should be set.
   * @format byte
   */
  key?: string

  /**
   * offset is a numeric offset that can be used when key is unavailable.
   * It is less efficient than using key. Only one of offset or key should
   * be set.
   * @format uint64
   */
  offset?: string

  /**
   * limit is the total number of results to be returned in the result page.
   * If left empty it will default to a value to be set by each app.
   * @format uint64
   */
  limit?: string

  /**
   * count_total is set to true  to indicate that the result set should include
   * a count of the total number of items available for pagination in UIs.
   * count_total is only respected when offset is used. It is ignored when key
   * is set.
   */
  count_total?: boolean

  /** reverse is set to true if results are to be returned in the descending order. */
  reverse?: boolean
}

/**
* PageResponse is to be embedded in gRPC response messages where the
corresponding request message has used PageRequest.

 message SomeResponse {
         repeated Bar results = 1;
         PageResponse page = 2;
 }
*/
export interface V1Beta1PageResponse {
  /**
   * next_key is the key to be passed to PageRequest.key to
   * query the next page most efficiently
   * @format byte
   */
  next_key?: string

  /**
   * total is total number of results available if PageRequest.count_total
   * was set, its value is undefined otherwise
   * @format uint64
   */
  total?: string
}

import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  ResponseType,
} from "axios"

export type QueryParamsType = Record<string | number, any>

export interface FullRequestParams
  extends Omit<
    AxiosRequestConfig,
    "data" | "params" | "url" | "responseType"
  > {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean
  /** request path */
  path: string
  /** content type of request body */
  type?: ContentType
  /** query params */
  query?: QueryParamsType
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType
  /** request body */
  body?: unknown
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void
  secure?: boolean
  format?: ResponseType
}

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance
  private securityData: SecurityDataType | null = null
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"]
  private secure?: boolean
  private format?: ResponseType

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "",
    })
    this.secure = secure
    this.format = format
    this.securityWorker = securityWorker
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data
  }

  private mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig
  ): AxiosRequestConfig {
    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.instance.defaults.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    }
  }

  private createFormData(input: Record<string, unknown>): FormData {
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key]
      formData.append(
        key,
        property instanceof Blob
          ? property
          : typeof property === "object" && property !== null
          ? JSON.stringify(property)
          : `${property}`
      )
      return formData
    }, new FormData())
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {}
    const requestParams = this.mergeRequestParams(
      params,
      secureParams
    )
    const responseFormat = (format && this.format) || void 0

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      requestParams.headers.common = { Accept: "*/*" }
      requestParams.headers.post = {}
      requestParams.headers.put = {}

      body = this.createFormData(body as Record<string, unknown>)
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(type && type !== ContentType.FormData
          ? { "Content-Type": type }
          : {}),
        ...(requestParams.headers || {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    })
  }
}

/**
 * @title gravity/v1/genesis.proto
 * @version version not set
 */
export class Api<
  SecurityDataType extends unknown
> extends HttpClient<SecurityDataType> {}
