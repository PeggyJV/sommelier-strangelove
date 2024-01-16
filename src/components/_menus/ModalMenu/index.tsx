import { VFC } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { Menu } from "./Menu"
import { BigNumber } from "ethers"
import { ModalOnlyTokenMenuProps, OnlyTokenMenu } from "./OnlyTokenMenu"

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
  isDisabled?: boolean
}

export const ModalMenu: VFC<ModalMenuProps> = ({
  depositTokens,
  activeAsset,
  selectedTokenBalance,
  setSelectedToken,
  isDisabled,
}) => {
  const { control } = useFormContext()

  return (
    <Controller
      control={control}
      name="selectedToken"
      render={({ field: { value, onChange } }) => {
        return (
          <Menu
            depositTokens={depositTokens}
            value={value}
            activeAsset={activeAsset}
            selectedTokenBalance={selectedTokenBalance}
            onChange={(data) => {
              // Todo: shouldn't need to do this hack
              setSelectedToken(data)
              onChange(data)
            }}
            isDisabled={isDisabled}
          />
        )
      }}
    />
  )
}

export const ModalOnlyTokenMenu: VFC<ModalOnlyTokenMenuProps> = ({
  depositTokens,
  activeAsset,
  setSelectedToken,
}) => {
  const { control } = useFormContext()

  return (
    <Controller
      control={control}
      name="selectedToken"
      render={({ field: { value, onChange } }) => {
        return (
          <OnlyTokenMenu
            depositTokens={depositTokens}
            value={value}
            activeAsset={activeAsset}
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