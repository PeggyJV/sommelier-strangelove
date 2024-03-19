export const signWithKeplr = async (
  sommelierAddress: string,
  ethAddress: string,
  sommAddress: string
) => {
  if (!window.getOfflineSigner || !window.keplr) {
    throw new Error("Please install Keplr extension")
  }

  const chainId = "sommelier-3" 
  await window.keplr.enable(chainId)
  const signer = window.getOfflineSigner(chainId)
  const accounts = await signer.getAccounts()

  if (accounts[0].address !== sommelierAddress) {
    throw new Error(
      "Keplr account does not match the provided Sommelier address"
    )
  }


  const message = `Sign this message to link your Ethereum address: ${ethAddress} with your Sommelier address: ${sommAddress}`
  const signBytes = new TextEncoder().encode(message)

  const { signature } = await signer.signAmino(accounts[0].address, {
    chain_id: chainId,
    account_number: "0",
    fee: { amount: [{ denom: "usomm", amount: "0" }], gas: "0" },
    msgs: [{ type: "sign/MsgSignText", value: { text: message } }],
    memo: "Linking ETH and SOMM addresses",
    sequence: ""
  })

  return { signature, message } 
}
