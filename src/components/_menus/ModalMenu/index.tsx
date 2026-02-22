import { FC } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { Menu } from "./Menu"
import { ModalOnlyTokenMenuProps, OnlyTokenMenu } from "./OnlyTokenMenu"
import { Token } from "data/tokenConfig"

export interface ModalMenuProps {
  depositTokens: string[]
  setSelectedToken: (value: Token) => void
  activeAsset?: string
  selectedTokenBalance?: {
    decimals: number
    formatted: string
    symbol: string
    value: bigint
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
            value={value as Token}
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
            value={value as Token}
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
