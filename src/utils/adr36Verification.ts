import { StdSignDoc } from "@keplr-wallet/types"
import { PubKeySecp256k1, Hash } from "@keplr-wallet/crypto"
import { Buffer } from "buffer/"
import { bech32 } from "bech32"

// Helper function to validate a Bech32 address
function validateBech32Address(address: string): boolean {
  try {
    bech32.decode(address)
    return true
  } catch (error) {
    return false
  }
}

// Helper function to serialize a SignDoc into a format that can be signed or verified
export function serializeSignDoc(signDoc: StdSignDoc): Uint8Array {
  const jsonString = JSON.stringify(signDoc)
  return new TextEncoder().encode(jsonString)
}

// Function to create an ADR-36 amino sign document
export function makeADR36AminoSignDoc(
  signer: string,
  data: string | Uint8Array
): StdSignDoc {
  const encodedData =
    typeof data === "string"
      ? Buffer.from(data).toString("base64")
      : Buffer.from(data).toString("base64")

  return {
    chain_id: "",
    account_number: "0",
    sequence: "0",
    fee: {
      gas: "0",
      amount: [],
    },
    msgs: [
      {
        type: "sign/MsgSignData",
        value: {
          signer,
          data: encodedData,
        },
      },
    ],
    memo: "",
  }
}

// Function to check and validate ADR-36 amino sign doc
export function checkAndValidateADR36AminoSignDoc(
  signDoc: StdSignDoc,
  bech32PrefixAccAddr?: string
): boolean {
  if (
    !signDoc.msgs ||
    signDoc.msgs.length !== 1 ||
    signDoc.msgs[0].type !== "sign/MsgSignData"
  ) {
    return false
  }

  const conditions = [
    signDoc.chain_id === "",
    signDoc.memo === "",
    signDoc.account_number === "0",
    signDoc.sequence === "0",
    signDoc.fee.gas === "0",
    signDoc.fee.amount.length === 0,
    signDoc.msgs[0].value &&
      typeof signDoc.msgs[0].value.data === "string",
  ]

  if (conditions.includes(false)) {
    throw new Error("Invalid ADR-36 sign doc")
  }

  const signer = signDoc.msgs[0].value.signer
  if (!validateBech32Address(signer)) {
    throw new Error("Invalid Bech32 address")
  }

  return true
}

// Function to verify an ADR-36 amino sign doc
export function verifyADR36AminoSignDoc(
  bech32PrefixAccAddr: string,
  signDoc: StdSignDoc,
  pubKey: Uint8Array,
  signature: Uint8Array,
  algo: "secp256k1" | "ethsecp256k1" = "secp256k1"
): boolean {
  if (
    !checkAndValidateADR36AminoSignDoc(signDoc, bech32PrefixAccAddr)
  ) {
    throw new Error("Invalid sign doc for ADR-36")
  }

  const cryptoPubKey = new PubKeySecp256k1(pubKey)
  const msg = serializeSignDoc(signDoc)
  const digest =
    algo === "ethsecp256k1" ? Hash.keccak256(msg) : Hash.sha256(msg)

  return cryptoPubKey.verifyDigest32(digest, signature)
}

// Wrapper function to simplify verification process
export function verifyADR36Amino(
  bech32PrefixAccAddr: string,
  signer: string,
  data: string | Uint8Array,
  pubKey: Uint8Array,
  signature: Uint8Array,
  algo: "secp256k1" | "ethsecp256k1" = "secp256k1"
): boolean {
  const signDoc = makeADR36AminoSignDoc(signer, data)
  return verifyADR36AminoSignDoc(
    bech32PrefixAccAddr,
    signDoc,
    pubKey,
    signature,
    algo
  )
}
