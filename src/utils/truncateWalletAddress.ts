const truncateWalletAddress = (
  string?: string,
  slice?: number
): string => {
  const pre = string?.slice(0, slice || 8)
  const post = string?.slice((slice || 8) * -1)

  return `${pre}...${post}`
}

export default truncateWalletAddress
