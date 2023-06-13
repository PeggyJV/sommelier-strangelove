// @ts-nocheck
// Generated by Ignite ignite.com/cli

import { StdFee } from "@cosmjs/launchpad"
import {
  SigningStargateClient,
  DeliverTxResponse,
  AminoTypes,
} from "@cosmjs/stargate"
import {
  EncodeObject,
  GeneratedType,
  OfflineSigner,
  Registry,
} from "@cosmjs/proto-signing"
import { msgTypes } from "./registry"
import { IgniteClient } from "../client"
import { Api } from "./rest"
import { MsgCancelSendToEthereum } from "./types/gravity/v1/msgs"
import { MsgRequestBatchTx } from "./types/gravity/v1/msgs"
import { MsgEthereumHeightVote } from "./types/gravity/v1/msgs"
import { MsgDelegateKeys } from "./types/gravity/v1/msgs"
import { MsgSubmitEthereumTxConfirmation } from "./types/gravity/v1/msgs"
import { MsgSendToEthereum } from "./types/gravity/v1/msgs"
import { MsgSubmitEthereumEvent } from "./types/gravity/v1/msgs"

import { Params as typeParams } from "./types"
import { ERC20ToDenom as typeERC20ToDenom } from "./types"
import { EthereumEventVoteRecord as typeEthereumEventVoteRecord } from "./types"
import { LatestEthereumBlockHeight as typeLatestEthereumBlockHeight } from "./types"
import { EthereumSigner as typeEthereumSigner } from "./types"
import { SignerSetTx as typeSignerSetTx } from "./types"
import { BatchTx as typeBatchTx } from "./types"
import { SendToEthereum as typeSendToEthereum } from "./types"
import { ContractCallTx as typeContractCallTx } from "./types"
import { ERC20Token as typeERC20Token } from "./types"
import { IDSet as typeIDSet } from "./types"
import { CommunityPoolEthereumSpendProposal as typeCommunityPoolEthereumSpendProposal } from "./types"
import { CommunityPoolEthereumSpendProposalForCLI as typeCommunityPoolEthereumSpendProposalForCLI } from "./types"
import { ContractCallTxConfirmation as typeContractCallTxConfirmation } from "./types"
import { BatchTxConfirmation as typeBatchTxConfirmation } from "./types"
import { SignerSetTxConfirmation as typeSignerSetTxConfirmation } from "./types"
import { DelegateKeysSignMsg as typeDelegateKeysSignMsg } from "./types"
import { SendToCosmosEvent as typeSendToCosmosEvent } from "./types"
import { BatchExecutedEvent as typeBatchExecutedEvent } from "./types"
import { ContractCallExecutedEvent as typeContractCallExecutedEvent } from "./types"
import { ERC20DeployedEvent as typeERC20DeployedEvent } from "./types"
import { SignerSetTxExecutedEvent as typeSignerSetTxExecutedEvent } from "./types"

export {
  MsgCancelSendToEthereum,
  MsgRequestBatchTx,
  MsgEthereumHeightVote,
  MsgDelegateKeys,
  MsgSubmitEthereumTxConfirmation,
  MsgSendToEthereum,
  MsgSubmitEthereumEvent,
}

type sendMsgCancelSendToEthereumParams = {
  value: MsgCancelSendToEthereum
  fee?: StdFee
  memo?: string
}

type sendMsgRequestBatchTxParams = {
  value: MsgRequestBatchTx
  fee?: StdFee
  memo?: string
}

type sendMsgEthereumHeightVoteParams = {
  value: MsgEthereumHeightVote
  fee?: StdFee
  memo?: string
}

type sendMsgDelegateKeysParams = {
  value: MsgDelegateKeys
  fee?: StdFee
  memo?: string
}

type sendMsgSubmitEthereumTxConfirmationParams = {
  value: MsgSubmitEthereumTxConfirmation
  fee?: StdFee
  memo?: string
}

type sendMsgSendToEthereumParams = {
  value: MsgSendToEthereum
  fee?: StdFee
  memo?: string
}

type sendMsgSubmitEthereumEventParams = {
  value: MsgSubmitEthereumEvent
  fee?: StdFee
  memo?: string
}

type msgCancelSendToEthereumParams = {
  value: MsgCancelSendToEthereum
}

type msgRequestBatchTxParams = {
  value: MsgRequestBatchTx
}

type msgEthereumHeightVoteParams = {
  value: MsgEthereumHeightVote
}

type msgDelegateKeysParams = {
  value: MsgDelegateKeys
}

type msgSubmitEthereumTxConfirmationParams = {
  value: MsgSubmitEthereumTxConfirmation
}

type msgSendToEthereumParams = {
  value: MsgSendToEthereum
}

type msgSubmitEthereumEventParams = {
  value: MsgSubmitEthereumEvent
}

export const registry = new Registry(msgTypes)

type Field = {
  name: string
  type: unknown
}
function getStructure(template) {
  const structure: { fields: Field[] } = { fields: [] }
  for (let [key, value] of Object.entries(template)) {
    let field = { name: key, type: typeof value }
    structure.fields.push(field)
  }
  return structure
}
const defaultFee = {
  amount: [],
  gas: "200000",
}

interface TxClientOptions {
  addr: string
  prefix: string
  signer?: OfflineSigner
}

export const txClient = (
  { signer, prefix, addr }: TxClientOptions = {
    addr: "http://localhost:26657",
    prefix: "cosmos",
  }
) => {
  return {
    async sendMsgCancelSendToEthereum({
      value,
      fee,
      memo,
    }: sendMsgCancelSendToEthereumParams): Promise<DeliverTxResponse> {
      if (!signer) {
        throw new Error(
          "TxClient:sendMsgCancelSendToEthereum: Unable to sign Tx. Signer is not present."
        )
      }
      try {
        const { address } = (await signer.getAccounts())[0]
        const signingClient =
          await SigningStargateClient.connectWithSigner(
            addr,
            signer,
            { registry, prefix }
          )
        let msg = this.msgCancelSendToEthereum({
          value: MsgCancelSendToEthereum.fromPartial(value),
        })
        return await signingClient.signAndBroadcast(
          address,
          [msg],
          fee ? fee : defaultFee,
          memo
        )
      } catch (e: any) {
        throw new Error(
          "TxClient:sendMsgCancelSendToEthereum: Could not broadcast Tx: " +
          e.message
        )
      }
    },

    async sendMsgRequestBatchTx({
      value,
      fee,
      memo,
    }: sendMsgRequestBatchTxParams): Promise<DeliverTxResponse> {
      if (!signer) {
        throw new Error(
          "TxClient:sendMsgRequestBatchTx: Unable to sign Tx. Signer is not present."
        )
      }
      try {
        const { address } = (await signer.getAccounts())[0]
        const signingClient =
          await SigningStargateClient.connectWithSigner(
            addr,
            signer,
            { registry, prefix }
          )
        let msg = this.msgRequestBatchTx({
          value: MsgRequestBatchTx.fromPartial(value),
        })
        return await signingClient.signAndBroadcast(
          address,
          [msg],
          fee ? fee : defaultFee,
          memo
        )
      } catch (e: any) {
        throw new Error(
          "TxClient:sendMsgRequestBatchTx: Could not broadcast Tx: " +
          e.message
        )
      }
    },

    async sendMsgEthereumHeightVote({
      value,
      fee,
      memo,
    }: sendMsgEthereumHeightVoteParams): Promise<DeliverTxResponse> {
      if (!signer) {
        throw new Error(
          "TxClient:sendMsgEthereumHeightVote: Unable to sign Tx. Signer is not present."
        )
      }
      try {
        const { address } = (await signer.getAccounts())[0]
        const signingClient =
          await SigningStargateClient.connectWithSigner(
            addr,
            signer,
            { registry, prefix }
          )
        let msg = this.msgEthereumHeightVote({
          value: MsgEthereumHeightVote.fromPartial(value),
        })
        return await signingClient.signAndBroadcast(
          address,
          [msg],
          fee ? fee : defaultFee,
          memo
        )
      } catch (e: any) {
        throw new Error(
          "TxClient:sendMsgEthereumHeightVote: Could not broadcast Tx: " +
          e.message
        )
      }
    },

    async sendMsgDelegateKeys({
      value,
      fee,
      memo,
    }: sendMsgDelegateKeysParams): Promise<DeliverTxResponse> {
      if (!signer) {
        throw new Error(
          "TxClient:sendMsgDelegateKeys: Unable to sign Tx. Signer is not present."
        )
      }
      try {
        const { address } = (await signer.getAccounts())[0]
        const signingClient =
          await SigningStargateClient.connectWithSigner(
            addr,
            signer,
            { registry, prefix }
          )
        let msg = this.msgDelegateKeys({
          value: MsgDelegateKeys.fromPartial(value),
        })
        return await signingClient.signAndBroadcast(
          address,
          [msg],
          fee ? fee : defaultFee,
          memo
        )
      } catch (e: any) {
        throw new Error(
          "TxClient:sendMsgDelegateKeys: Could not broadcast Tx: " +
          e.message
        )
      }
    },

    async sendMsgSubmitEthereumTxConfirmation({
      value,
      fee,
      memo,
    }: sendMsgSubmitEthereumTxConfirmationParams): Promise<DeliverTxResponse> {
      if (!signer) {
        throw new Error(
          "TxClient:sendMsgSubmitEthereumTxConfirmation: Unable to sign Tx. Signer is not present."
        )
      }
      try {
        const { address } = (await signer.getAccounts())[0]
        const signingClient =
          await SigningStargateClient.connectWithSigner(
            addr,
            signer,
            { registry, prefix }
          )
        let msg = this.msgSubmitEthereumTxConfirmation({
          value: MsgSubmitEthereumTxConfirmation.fromPartial(value),
        })
        return await signingClient.signAndBroadcast(
          address,
          [msg],
          fee ? fee : defaultFee,
          memo
        )
      } catch (e: any) {
        throw new Error(
          "TxClient:sendMsgSubmitEthereumTxConfirmation: Could not broadcast Tx: " +
          e.message
        )
      }
    },

    async sendMsgSendToEthereum({
      value,
      fee,
      memo,
    }: sendMsgSendToEthereumParams): Promise<DeliverTxResponse> {
      if (!signer) {
        throw new Error(
          "TxClient:sendMsgSendToEthereum: Unable to sign Tx. Signer is not present."
        )
      }
      const gravityTypes = {
        "/gravity.v1.MsgSendToEthereum": {
          aminoType: "gravity-bridge/MsgSendToEthereum",
          toAmino: (msg) => {
            return {
                amount: {
                  amount: msg.amount.amount,
                  denom: msg.amount.denom,
                },
                bridge_fee: {
                  amount: msg.bridgeFee.amount,
                  denom: msg.bridgeFee.denom,
                },
                ethereum_recipient: msg.ethereumRecipient,
                sender: msg.sender,
              }
          },
          fromAmino: (msg) => {
            return {
              amount: msg.amount,
              bridgeFee: msg.bridge_fee,
              ethereumRecipient: msg.ethereum_recipient,
              sender: msg.sender,
            }
          },
        },
      }
      const aminoTypes = new AminoTypes(gravityTypes)
      try {
        const { address } = (await signer.getAccounts())[0]
        const signingClient =
          await SigningStargateClient.connectWithSigner(
            addr,
            signer,
            { registry, prefix, aminoTypes: aminoTypes }
          )
        let msg = this.msgSendToEthereum({
          value: MsgSendToEthereum.fromPartial(value),
        })
        return await signingClient.signAndBroadcast(
          address,
          [msg],
          fee ? fee : defaultFee,
          memo
        )
      } catch (e: any) {
        throw new Error(
          "TxClient:sendMsgSendToEthereum: Could not broadcast Tx: " +
          e.message
        )
      }
    },

    async sendMsgSubmitEthereumEvent({
      value,
      fee,
      memo,
    }: sendMsgSubmitEthereumEventParams): Promise<DeliverTxResponse> {
      if (!signer) {
        throw new Error(
          "TxClient:sendMsgSubmitEthereumEvent: Unable to sign Tx. Signer is not present."
        )
      }
      try {
        const { address } = (await signer.getAccounts())[0]
        const signingClient =
          await SigningStargateClient.connectWithSigner(
            addr,
            signer,
            { registry, prefix }
          )
        let msg = this.msgSubmitEthereumEvent({
          value: MsgSubmitEthereumEvent.fromPartial(value),
        })
        return await signingClient.signAndBroadcast(
          address,
          [msg],
          fee ? fee : defaultFee,
          memo
        )
      } catch (e: any) {
        throw new Error(
          "TxClient:sendMsgSubmitEthereumEvent: Could not broadcast Tx: " +
          e.message
        )
      }
    },

    msgCancelSendToEthereum({
      value,
    }: msgCancelSendToEthereumParams): EncodeObject {
      try {
        return {
          typeUrl: "/gravity.v1.MsgCancelSendToEthereum",
          value: MsgCancelSendToEthereum.fromPartial(value),
        }
      } catch (e: any) {
        throw new Error(
          "TxClient:MsgCancelSendToEthereum: Could not create message: " +
          e.message
        )
      }
    },

    msgRequestBatchTx({
      value,
    }: msgRequestBatchTxParams): EncodeObject {
      try {
        return {
          typeUrl: "/gravity.v1.MsgRequestBatchTx",
          value: MsgRequestBatchTx.fromPartial(value),
        }
      } catch (e: any) {
        throw new Error(
          "TxClient:MsgRequestBatchTx: Could not create message: " +
          e.message
        )
      }
    },

    msgEthereumHeightVote({
      value,
    }: msgEthereumHeightVoteParams): EncodeObject {
      try {
        return {
          typeUrl: "/gravity.v1.MsgEthereumHeightVote",
          value: MsgEthereumHeightVote.fromPartial(value),
        }
      } catch (e: any) {
        throw new Error(
          "TxClient:MsgEthereumHeightVote: Could not create message: " +
          e.message
        )
      }
    },

    msgDelegateKeys({ value }: msgDelegateKeysParams): EncodeObject {
      try {
        return {
          typeUrl: "/gravity.v1.MsgDelegateKeys",
          value: MsgDelegateKeys.fromPartial(value),
        }
      } catch (e: any) {
        throw new Error(
          "TxClient:MsgDelegateKeys: Could not create message: " +
          e.message
        )
      }
    },

    msgSubmitEthereumTxConfirmation({
      value,
    }: msgSubmitEthereumTxConfirmationParams): EncodeObject {
      try {
        return {
          typeUrl: "/gravity.v1.MsgSubmitEthereumTxConfirmation",
          value: MsgSubmitEthereumTxConfirmation.fromPartial(value),
        }
      } catch (e: any) {
        throw new Error(
          "TxClient:MsgSubmitEthereumTxConfirmation: Could not create message: " +
          e.message
        )
      }
    },

    msgSendToEthereum({
      value,
    }: msgSendToEthereumParams): EncodeObject {
      try {
        return {
          typeUrl: "/gravity.v1.MsgSendToEthereum",
          value: MsgSendToEthereum.fromPartial(value),
        }
      } catch (e: any) {
        throw new Error(
          "TxClient:MsgSendToEthereum: Could not create message: " +
          e.message
        )
      }
    },

    msgSubmitEthereumEvent({
      value,
    }: msgSubmitEthereumEventParams): EncodeObject {
      try {
        return {
          typeUrl: "/gravity.v1.MsgSubmitEthereumEvent",
          value: MsgSubmitEthereumEvent.fromPartial(value),
        }
      } catch (e: any) {
        throw new Error(
          "TxClient:MsgSubmitEthereumEvent: Could not create message: " +
          e.message
        )
      }
    },
  }
}

interface QueryClientOptions {
  addr: string
}

export const queryClient = (
  { addr: addr }: QueryClientOptions = {
    addr: "http://localhost:1317",
  }
) => {
  return new Api({ baseURL: addr })
}

class SDKModule {
  public query: ReturnType<typeof queryClient>
  public tx: ReturnType<typeof txClient>
  public structure: Record<string, unknown>
  public registry: Array<[string, GeneratedType]> = []

  constructor(client: IgniteClient) {
    this.query = queryClient({ addr: client.env.apiURL })
    this.updateTX(client)
    this.structure = {
      Params: getStructure(typeParams.fromPartial({})),
      ERC20ToDenom: getStructure(typeERC20ToDenom.fromPartial({})),
      EthereumEventVoteRecord: getStructure(
        typeEthereumEventVoteRecord.fromPartial({})
      ),
      LatestEthereumBlockHeight: getStructure(
        typeLatestEthereumBlockHeight.fromPartial({})
      ),
      EthereumSigner: getStructure(
        typeEthereumSigner.fromPartial({})
      ),
      SignerSetTx: getStructure(typeSignerSetTx.fromPartial({})),
      BatchTx: getStructure(typeBatchTx.fromPartial({})),
      SendToEthereum: getStructure(
        typeSendToEthereum.fromPartial({})
      ),
      ContractCallTx: getStructure(
        typeContractCallTx.fromPartial({})
      ),
      ERC20Token: getStructure(typeERC20Token.fromPartial({})),
      IDSet: getStructure(typeIDSet.fromPartial({})),
      CommunityPoolEthereumSpendProposal: getStructure(
        typeCommunityPoolEthereumSpendProposal.fromPartial({})
      ),
      CommunityPoolEthereumSpendProposalForCLI: getStructure(
        typeCommunityPoolEthereumSpendProposalForCLI.fromPartial({})
      ),
      ContractCallTxConfirmation: getStructure(
        typeContractCallTxConfirmation.fromPartial({})
      ),
      BatchTxConfirmation: getStructure(
        typeBatchTxConfirmation.fromPartial({})
      ),
      SignerSetTxConfirmation: getStructure(
        typeSignerSetTxConfirmation.fromPartial({})
      ),
      DelegateKeysSignMsg: getStructure(
        typeDelegateKeysSignMsg.fromPartial({})
      ),
      SendToCosmosEvent: getStructure(
        typeSendToCosmosEvent.fromPartial({})
      ),
      BatchExecutedEvent: getStructure(
        typeBatchExecutedEvent.fromPartial({})
      ),
      ContractCallExecutedEvent: getStructure(
        typeContractCallExecutedEvent.fromPartial({})
      ),
      ERC20DeployedEvent: getStructure(
        typeERC20DeployedEvent.fromPartial({})
      ),
      SignerSetTxExecutedEvent: getStructure(
        typeSignerSetTxExecutedEvent.fromPartial({})
      ),
    }
    client.on("signer-changed", (signer) => {
      this.updateTX(client)
    })
  }
  updateTX(client: IgniteClient) {
    const methods = txClient({
      signer: client.signer,
      addr: client.env.rpcURL,
      prefix: client.env.prefix ?? "cosmos",
    })

    this.tx = methods
    for (let m in methods) {
      this.tx[m] = methods[m].bind(this.tx)
    }
  }
}

const Module = (test: IgniteClient) => {
  return {
    module: {
      GravityV1: new SDKModule(test),
    },
    registry: msgTypes,
  }
}
export default Module
