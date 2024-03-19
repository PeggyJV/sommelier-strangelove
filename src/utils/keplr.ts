export const signWithKeplr = async (
  sommelierAddress: string,
  ethAddress: string,
  sommAddress: string
) => {
  // Check if Keplr extension is installed
  if (!window.keplr) {
    throw new Error("Please install Keplr extension")
  }

  // Chain ID for the blockchain you're interacting with
  const chainId = "sommelier-3"
  // Request user to enable access to their Keplr wallet for the specified chain
  await window.keplr.enable(chainId)

  // Ensure getOfflineSigner exists before attempting to use it
  if (typeof window.getOfflineSigner !== "function") {
    throw new Error(
      "Keplr extension is not installed or not available in this context."
    )
  }

  // Getting the offline signer for the chain
  const signer = window.getOfflineSigner(chainId)
  // Fetching the accounts associated with the offline signer
  const accounts = await signer.getAccounts()

  // Verify the first account's address matches the provided Sommelier address
  if (accounts[0].address !== sommelierAddress) {
    throw new Error(
      "Keplr account does not match the provided Sommelier address"
    )
  }

  // Construct the message to be signed
  const message = `Sign this message to link your Ethereum address: ${ethAddress} with your Sommelier address: ${sommAddress}`

  // Use signArbitrary for signing the message
  const { signature } = await window.keplr.signArbitrary(
    chainId,
    accounts[0].address,
    message
  )

  // Return the signature and the original message
  return { signature, message }
}
