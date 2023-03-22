import { Box, BoxProps, Heading, Text } from "@chakra-ui/react"
import { PortableText } from "@portabletext/react"
import { components } from "components/Strategy/portableText"
import { NextPage } from "next"
import { SectionCellarsWithImage } from "types/sanity"
import { StrategyProviders } from "./StrategyProvider"
interface CellarsProps extends BoxProps {
  data: SectionCellarsWithImage
}

export const Cellars: NextPage<CellarsProps> = ({
  data,
  ...rest
}) => {
  return (
    <Box {...rest}>
      <Box maxW="40rem">
        {data?.title?.block && (
          <Heading
            mb={10}
            fontWeight="700"
            lineHeight={{ base: "116%", md: "110%" }}
            fontSize={{ base: "2xl", md: "4xl" }}
            letterSpacing="-1%"
          >
            <PortableText
              value={data?.title.block}
              components={components}
            />
          </Heading>
        )}
        <Text
          fontSize={{ base: "button", md: "2xl" }}
          color="neutral.300"
        >
          {data?.subtitle}
        </Text>
      </Box>
      <Box
        maxW={{ base: "100%", lg: "97%" }}
        position="relative"
        zIndex="2"
        mt={20}
      >
        <StrategyProviders />
      </Box>
    </Box>
  )
}
