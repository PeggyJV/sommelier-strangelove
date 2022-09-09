import { useContract } from "wagmi"

export interface ContractProps {
  contract: ReturnType<typeof useContract>
  key: string
  signer: ReturnType<typeof useContract>
}
