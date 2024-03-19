export const signWithKeplr = async (sommelierAddress) => {
  if (!window.getOfflineSigner || !window.keplr) {
    throw new Error("Please install Keplr extension")
  }

  const chainId = "YOUR_CHAIN_ID" // Replace with your chain ID
  await window.keplr.enable(chainId)
  const signer = window.getOfflineSigner(chainId)
  const accounts = await signer.getAccounts()

  // Ensure the Keplr account matches the provided Sommelier address
  if (accounts[0].address !== sommelierAddress) {
    throw new Error(
      "Keplr account does not match the provided Sommelier address"
    )
  }

  // Replace with your actual message
  const message = "Sign this message to link your addresses"
  const signBytes = new TextEncoder().encode(message)

  const { signature } = await signer.signAmino(accounts[0].address, {
    chain_id: chainId,
    account_number: "0", // These values might need to be fetched or set correctly for your use case
    sequence: "0",
    fee: { amount: [{ denom: "uscrt", amount: "0" }], gas: "1" },
    msgs: [{ type: "sign/MsgSignText", value: { text: message } }],
    memo: "",
  })

  return signature
}
