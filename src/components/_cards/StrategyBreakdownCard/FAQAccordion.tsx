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
import parse from "html-react-parser"
import { useEffect, useMemo, useState } from "react"

interface Props extends AccordionProps {
  data: {
    id?: string
    question: string
    answer: string
  }[]
}

export const FAQAccordion: React.FC<Props> = ({ data, ...rest }) => {
  if (!data) return null

  const [expandedIndex, setExpandedIndex] = useState<number[] | undefined>(
    undefined
  )

  const getStableId = (q?: string, provided?: string) => {
    if (provided) return provided
    const text = (q || "").toLowerCase()
    if (text.includes("what fees are applied")) return "faq-fees"
    if (text.includes("what is apy for alpha steth")) return "faq-apy"
    return undefined
  }

  const idToIndex = useMemo(() => {
    const map = new Map<string, number>()
    data.forEach((item, idx) => {
      const stable = getStableId(item?.question, item?.id)
      if (stable) map.set(stable.toLowerCase(), idx)
    })
    return map
  }, [data])

  useEffect(() => {
    if (typeof window === "undefined") return
    const hash = window.location.hash?.slice(1).toLowerCase()
    if (!hash) return
    const idx = idToIndex.get(hash)
    if (idx !== undefined) {
      setExpandedIndex([idx])
      setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }, 50)
    }
  }, [idToIndex])

  const handleChange = (val: number | number[]) => {
    if (Array.isArray(val)) setExpandedIndex(val)
    else setExpandedIndex([val])
  }

  return (
    <Accordion
      allowMultiple
      borderColor="purple.dark"
      index={expandedIndex}
      onChange={handleChange as any}
      {...rest}
    >
      {data.map((item, index) => {
        const stableId = getStableId(item?.question, item?.id)
        return (
          <AccordionItem
            key={index}
            id={stableId}
            data-faq-id={stableId}
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
                  {item.answer && parse(item.answer)}
                </AccordionPanel>
              </>
            )}
          </AccordionItem>
        )
      })}
    </Accordion>
  )
}
