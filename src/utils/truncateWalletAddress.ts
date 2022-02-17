const truncateWalletAddress = (string?: string): string => {
  const pre = string?.slice(0, 8)
  const post = string?.slice(-8)

  return `${pre}...${post}`
}

export default truncateWalletAddress
