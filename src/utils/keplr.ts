export const signWithKeplr = async (
  sommelierAddress: string,
  ethAddress: string,
  sommAddress: string
) => {
  if (!window.keplr) {
    throw new Error("Please install Keplr extension")
  }

  const chainId = "sommelier-3"
  await window.keplr.enable(chainId)

  if (typeof window.getOfflineSigner !== "function") {
    throw new Error(
      "Keplr extension is not installed or not available in this context."
    )
  }

  const signer = window.getOfflineSigner(chainId)
  const accounts = await signer.getAccounts()

  if (accounts[0].address !== sommelierAddress) {
    throw new Error(
      "Keplr account does not match the provided Sommelier address"
    )
  }

  const messageContent = {
    ethAddress: ethAddress,
    sommAddress: sommAddress,
  }

  // Serialize the message content to a string for signing
  const message = JSON.stringify(messageContent)

  // Sign the message
  const { signature } = await window.keplr.signArbitrary(
    chainId,
    accounts[0].address,
    message
  )

  // Obtain the public key in Base64 format
  const pubKey = Buffer.from(accounts[0].pubkey).toString("base64")

  const dataString = Buffer.from(
    JSON.stringify(messageContent)
  ).toString("base64")

  // Include this dataString in the messageBundle that the function returns
  const messageBundle = {
    messageContent, // Including the original message content for clarity
    signature: signature,
    pubKey: pubKey,
    data: dataString, // Add this line
  }

  return messageBundle
}
