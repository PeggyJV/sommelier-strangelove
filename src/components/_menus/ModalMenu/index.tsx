import { FC } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { Menu } from "./Menu"
import { ModalOnlyTokenMenuProps, OnlyTokenMenu } from "./OnlyTokenMenu"

export interface ModalMenuProps {
  depositTokens: string[]
  setSelectedToken: (value: any) => void
  activeAsset?: string
  selectedTokenBalance?: {
    decimals: number
    formatted: string
    symbol: string
    value: BigInt
  }
  isDisabled?: boolean
}

export const ModalMenu: FC<ModalMenuProps> = ({
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

export const ModalOnlyTokenMenu: FC<ModalOnlyTokenMenuProps> = ({
  depositTokens,
  activeAsset,
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
          <OnlyTokenMenu
            depositTokens={depositTokens}
            value={value}
            activeAsset={activeAsset}
            isDisabled={isDisabled}
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
