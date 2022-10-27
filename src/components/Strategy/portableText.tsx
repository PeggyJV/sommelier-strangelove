import { FC } from "react"
import {
  PortableTextComponent,
  PortableTextComponents,
  PortableTextTypeComponent,
  PortableTextTypeComponentProps,
} from "@portabletext/react"
import { PortableTextBlock } from "@portabletext/types"
import { useTypingText } from "hooks/useTypingText"
import { Text } from "@chakra-ui/react"

const normal: PortableTextComponent<PortableTextBlock> = ({
  children,
}) => {
  return <Text as="span">{children}</Text>
}

const lineBreak: PortableTextTypeComponent = ({ value }) => {
  const { style } = value
  const isLineBreak: boolean = style === "lineBreak"
  return isLineBreak ? <br /> : <hr />
}

const typedTextList: FC<
  PortableTextTypeComponentProps<{
    list: string[]
    keyStrokeDuration: number
    pauseDuration: number
  }>
> = ({ value }) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { word } = useTypingText(
    value.list,
    value.keyStrokeDuration,
    value.pauseDuration
  )
  return <Text as="span">{word}</Text>
}

export const components: PortableTextComponents = {
  block: {
    normal,
  },
  types: {
    typedTextList,
    lineBreak,
  },
}
