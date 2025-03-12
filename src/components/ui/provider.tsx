import { ChakraProvider } from "@chakra-ui/react"
import { ReactNode } from "react"
import { system } from "../../theme/theme"
import { ColorModeProvider } from "./color-mode"

export function Provider({ children }: { children: ReactNode }) {
  return (
    <ChakraProvider value={system}>
      <ColorModeProvider>{children}</ColorModeProvider>
    </ChakraProvider>
  )
}
