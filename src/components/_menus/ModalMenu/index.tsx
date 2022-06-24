import { VFC } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { Menu } from "./Menu"
import { BigNumber } from "ethers"

export interface ModalMenuProps {
  setSelectedToken: (value: any) => void
  activeAsset?: string
  selectedTokenBalance: {
    readonly data:
      | {
          decimals: number
          formatted: string
          symbol: string
          value: BigNumber
        }
      | undefined
    readonly error: Error | undefined
    readonly loading: boolean | undefined
  }
}

export const ModalMenu: VFC<ModalMenuProps> = ({
  activeAsset,
  selectedTokenBalance,
  setSelectedToken,
}) => {
  const { control } = useFormContext()

  return (
    <Controller
      control={control}
      name="selectedToken"
      render={({ field: { value, onChange } }) => {
        return (
          <Menu
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
