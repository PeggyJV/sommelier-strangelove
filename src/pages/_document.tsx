import { ColorModeScript } from "@chakra-ui/react"
import { NextPage } from "next"
import { Head, Html, Main, NextScript } from "next/document"
import { config } from "theme/index"

const CustomDocument: NextPage = () => {
  return (
    <Html lang="en">
      <Head />
      <body>
        <ColorModeScript initialColorMode={config.initialColorMode} />
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

export default CustomDocument
