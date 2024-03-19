// Updated signWithKeplr function to include ETH and SOMM addresses in the signing process.
export const signWithKeplr = async (
  sommelierAddress: string,
  ethAddress: string,
  sommAddress: string
) => {
  if (!window.getOfflineSigner || !window.keplr) {
    throw new Error("Please install Keplr extension")
  }

  const chainId = "sommelier-3" // Ensure this matches your actual chain ID
  await window.keplr.enable(chainId)
  const signer = window.getOfflineSigner(chainId)
  const accounts = await signer.getAccounts()

  // Ensure the Keplr account matches the provided Sommelier address
  if (accounts[0].address !== sommelierAddress) {
    throw new Error(
      "Keplr account does not match the provided Sommelier address"
    )
  }

  // Include both ETH and SOMM addresses in the message
  const message = `Sign this message to link your Ethereum address: ${ethAddress} with your Sommelier address: ${sommAddress}`
  const signBytes = new TextEncoder().encode(message)

  const { signature } = await signer.signAmino(accounts[0].address, {
    chain_id: chainId,
    account_number: "0", // These values might need to be fetched or set correctly for your use case
    sequence: "0",
    fee: { amount: [{ denom: "usomm", amount: "0" }], gas: "1" },
    msgs: [{ type: "sign/MsgSignText", value: { text: message } }],
    memo: "Linking ETH and SOMM addresses",
  })

  return { signature, message } // Return both the signature and the signed message
}
