import {
  Accordion,
  AccordionItem,
  AccordionButton,
  Box,
  AccordionPanel,
  Text,
  AccordionProps,
  Icon,
} from "@chakra-ui/react"
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai"
import htmr from "htmr"

interface Props extends AccordionProps {
  data: {
    question: string
    answer: string
  }[]
}

export const FAQAccordion: React.FC<Props> = ({ data, ...rest }) => {
  if (!data) return null
  return (
    <Accordion allowMultiple borderColor="purple.dark" {...rest}>
      {data.map((item, index) => {
        return (
          <AccordionItem
            key={index}
            py={4}
            _first={{ borderTop: "none" }}
          >
            {({ isExpanded }) => (
              <>
                <AccordionButton px={0} py={{ base: 0, lg: 2 }}>
                  <Box flex="1" textAlign="left">
                    <Text
                      fontWeight="bold"
                      fontSize={{ base: "xs", lg: "lg" }}
                      color="neutral.100"
                    >
                      {item.question}
                    </Text>
                  </Box>
                  <Icon
                    as={isExpanded ? AiOutlineMinus : AiOutlinePlus}
                  />
                </AccordionButton>
                <AccordionPanel pb={4} px={0}>
                  {item.answer && htmr(item.answer)}
                </AccordionPanel>
              </>
            )}
          </AccordionItem>
        )
      })}
    </Accordion>
  )
}
