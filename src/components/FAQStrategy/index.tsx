import { Heading, Flex, FlexProps } from "@chakra-ui/react"
import { CustomFaqSection } from "types/sanity"
import { FAQTabs } from "./FAQTabs"
interface Props extends FlexProps {
  data: CustomFaqSection
}

export const FAQStrategy: React.FC<Props> = ({ data, ...rest }) => {
  return (
    <Flex
      backgroundColor="primary.extraDark"
      position="relative"
      overflow="hidden"
      direction="column"
      {...rest}
    >
      <Heading
        mb={{ base: 12, md: 20 }}
        pt={{ base: 36, md: 0 }}
        fontSize={{ base: "2xl", md: "4xl", lg: "2.5rem" }}
        fontWeight="700"
        lineHeight={{ base: "115%", md: "110%" }}
      >
        {data.title}
      </Heading>
      <FAQTabs data={data.faqTabs} />
    </Flex>
  )
}
