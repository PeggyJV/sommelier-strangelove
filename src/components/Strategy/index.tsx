import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

import {
  Box,
  BoxProps,
  HStack,
  IconButton,
  Link,
  Text,
} from "@chakra-ui/react"
import { SectionStrategiesWithImages } from "types/sanity"
import { useState, VFC } from "react"
import { PortableText } from "@portabletext/react"
import { HeadingHeavy } from "components/HeadingHeavy"
import { components } from "./portableText"
import { SliderStrategy } from "./Carousel/SliderStrategy"
import Slider from "react-slick"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"
import { ArrowRightIcon } from "components/_icons"
import { SecondaryButton } from "components/_buttons/SecondaryButton"

interface StrategyProps extends BoxProps {
  data: SectionStrategiesWithImages
}

export const Strategy: VFC<StrategyProps> = ({ data, ...rest }) => {
  const [sliderRef, setSliderRef] = useState<Slider | null>(null)
  return (
    <Box {...rest}>
      <Box
        height={{
          base: "calc(40rem - 50vw)",
          sm: "calc(40rem - 50vw)",
          md: "calc(57rem - 50vw)",
          lg: "calc(50rem - 50vw)",
          xl: "full",
        }}
      >
        {data?.title?.block && (
          <HeadingHeavy mb={10}>
            <PortableText
              value={data?.title.block}
              components={components}
            />
          </HeadingHeavy>
        )}
        <Text
          fontSize={{ base: "button", md: "2xl" }}
          color="neutral.300"
          mb={16}
        >
          {data?.subtitle}
        </Text>
      </Box>
      <Box mb={20} mt={2}>
        <SliderStrategy
          setSliderRef={setSliderRef}
          data={data?.strategies}
        />
        <HStack mt={6} pl={15}>
          <IconButton
            aria-label="next"
            icon={<FaChevronLeft />}
            onClick={sliderRef?.slickPrev}
            border="3px solid"
            borderColor="purple.base"
            background="transparent"
            _hover={{
              borderColor: "purple.base",
              background: "transparent",
            }}
            display={{
              base: "flex",
              xl: "none",
            }}
          />
          <IconButton
            aria-label="next"
            icon={<FaChevronRight />}
            onClick={sliderRef?.slickNext}
            border="3px solid"
            borderColor="purple.base"
            background="transparent"
            _hover={{
              borderColor: "purple.base",
              background: "transparent",
            }}
            display={{
              base: "flex",
              xl: "none",
            }}
          />
        </HStack>
      </Box>

      <Link
        isExternal
        href="https://app.sommelier.finance"
        textDecoration="none"
        style={{ textDecoration: "none" }}
      >
        <SecondaryButton
          fontSize="md"
          px={4}
          py={2}
          h="50px"
          rightIcon={<ArrowRightIcon />}
          textDecoration="none"
        >
          Explore strategies
        </SecondaryButton>
      </Link>
    </Box>
  )
}
