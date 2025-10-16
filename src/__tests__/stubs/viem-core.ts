export const createPublicClient = (_opts: any) => {
  return {
    async getBlockNumber() {
      throw new Error("HTTP request failed")
    },
    async readContract({ abi }: any) {
      if (!abi || (Array.isArray(abi) && abi.length === 0)) {
        throw new Error("AbiFunctionNotFoundError")
      }
      throw new Error("Contract read failed")
    },
  }
}

export const http = (..._args: any[]) => ({})
