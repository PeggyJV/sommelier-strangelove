import { VFC } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { Menu } from "./Menu"

export const ModalMenu: VFC = () => {
  const { control } = useFormContext()
  return (
    <Controller
      control={control}
      name="selectedToken"
      render={({ field: { value, onChange } }) => {
        return <Menu value={value} onChange={onChange} />
      }}
    />
  )
}
