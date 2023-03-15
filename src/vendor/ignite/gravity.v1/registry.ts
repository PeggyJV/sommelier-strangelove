import { GeneratedType } from "@cosmjs/proto-signing";
import { MsgCancelSendToEthereum } from "./types/gravity/v1/msgs";
import { MsgRequestBatchTx } from "./types/gravity/v1/msgs";
import { MsgEthereumHeightVote } from "./types/gravity/v1/msgs";
import { MsgDelegateKeys } from "./types/gravity/v1/msgs";
import { MsgSubmitEthereumTxConfirmation } from "./types/gravity/v1/msgs";
import { MsgSendToEthereum } from "./types/gravity/v1/msgs";
import { MsgSubmitEthereumEvent } from "./types/gravity/v1/msgs";

const msgTypes: Array<[string, GeneratedType]>  = [
    ["/gravity.v1.MsgCancelSendToEthereum", MsgCancelSendToEthereum],
    ["/gravity.v1.MsgRequestBatchTx", MsgRequestBatchTx],
    ["/gravity.v1.MsgEthereumHeightVote", MsgEthereumHeightVote],
    ["/gravity.v1.MsgDelegateKeys", MsgDelegateKeys],
    ["/gravity.v1.MsgSubmitEthereumTxConfirmation", MsgSubmitEthereumTxConfirmation],
    ["/gravity.v1.MsgSendToEthereum", MsgSendToEthereum],
    ["/gravity.v1.MsgSubmitEthereumEvent", MsgSubmitEthereumEvent],
    
];

export { msgTypes }