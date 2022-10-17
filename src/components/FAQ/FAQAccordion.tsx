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
import { PortableText } from "@portabletext/react"
import { FaqItem } from "types/sanity"
import { FAQComponents } from "./portableText"
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai"

interface Props extends AccordionProps {
  data: FaqItem[] | undefined
}

export const FAQAccordion: React.FC<Props> = ({ data, ...rest }) => {
  if (!data) return null
  return (
    <Accordion
      allowMultiple
      borderColor="surface.secondary"
      {...rest}
    >
      {data.map((faq: FaqItem) => {
        return (
          <AccordionItem
            key={faq._id}
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
                      {faq.question}
                    </Text>
                  </Box>
                  <Icon
                    as={isExpanded ? AiOutlineMinus : AiOutlinePlus}
                  />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  {faq.answer && (
                    <PortableText
                      value={faq.answer}
                      components={{ ...FAQComponents }}
                    />
                  )}
                </AccordionPanel>
              </>
            )}
          </AccordionItem>
        )
      })}
    </Accordion>
  )
}
