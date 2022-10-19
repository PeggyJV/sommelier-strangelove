import { Box, Heading } from "@chakra-ui/react"
import { FaqTabWithRef } from "types/sanity"
import FAQTabs from "./FAQTabs"

interface FAQProps {
  data?: FaqTabWithRef[]
}

const FAQ: React.FC<FAQProps> = ({ data }) => {
  return (
    <>
      <Box mb={9}>
        <Heading>Learn more</Heading>
      </Box>
      <FAQTabs data={data} />
    </>
  )
}

export default FAQ
