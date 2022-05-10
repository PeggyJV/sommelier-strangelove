import { VFC } from "react"
import { Controller, useFormContext, Control } from "react-hook-form"
import { Menu } from "./Menu"
import { Token } from "data/tokenConfig"

type Props = {
  setSelectedToken: React.Dispatch<React.SetStateAction<Token>>
}
export const ModalMenu: VFC<Props> = ({ setSelectedToken }) => {
  const { control } = useFormContext()

  return (
    <Controller
      control={control}
      name="selectedToken"
      render={({ field: { value, onChange } }) => {
        return (
          <Menu
            value={value}
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
