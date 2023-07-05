import { create } from "zustand"

export type DepositModalType = "deposit" | "withdraw"

interface DepositModalStore {
  isOpen: boolean
  id: string
  type: DepositModalType
  onClose: () => void
  setIsOpen: (data: { id: string; type: DepositModalType }) => void
}

export const useDepositModalStore = create<DepositModalStore>(
  (set) => ({
    isOpen: false,
    id: "",
    type: "deposit",
    onClose: () => set({ isOpen: false }),
    setIsOpen: ({ id, type }) =>
      set({ isOpen: true, id: id, type: type }),
  })
)
