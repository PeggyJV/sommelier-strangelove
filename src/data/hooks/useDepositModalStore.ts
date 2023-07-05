import { create } from "zustand"

interface DepositModalStore {
  isOpen: boolean
  id: string
  onClose: () => void
  setIsOpen: (id: string) => void
}

export const useDepositModalStore = create<DepositModalStore>(
  (set) => ({
    isOpen: false,
    id: "",
    onClose: () => set({ isOpen: false }),
    setIsOpen: (id: string) => set({ isOpen: true, id: id }),
  })
)
