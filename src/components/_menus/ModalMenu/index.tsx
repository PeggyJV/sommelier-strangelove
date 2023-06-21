import { VFC } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { Menu } from "./Menu"
import { BigNumber } from "ethers"

export interface ModalMenuProps {
  depositTokens: string[]
  setSelectedToken: (value: any) => void
  activeAsset?: string
  selectedTokenBalance?: {
    decimals: number
    formatted: string
    symbol: string
    value: BigNumber
  }
  id?: string
}

export const ModalMenu: VFC<ModalMenuProps> = ({
  depositTokens,
  activeAsset,
  selectedTokenBalance,
  setSelectedToken,
  id,
}) => {
  const { control } = useFormContext()

  return (
    <Controller
      control={control}
      name="selectedToken"
      render={({ field: { value, onChange } }) => {
        return (
          <Menu
            id={id}
            depositTokens={depositTokens}
            value={value}
            activeAsset={activeAsset}
            selectedTokenBalance={selectedTokenBalance}
            onChange={(data) => {
              // Todo: shouldn't need to do this hack
              setSelectedToken(data)
              onChange(data)
            }}
          />
        )
      }}
    />
  )
}
