import {
  Box,
  BoxProps,
  Heading,
  Text,
  Wrap,
  Image,
} from "@chakra-ui/react"
import { FC, LegacyRef } from "react"

import { sliderSettings } from "./sliderSettings"
import Slider from "react-slick"
import { PortableText } from "@portabletext/react"
import { StrategyWithImage } from "types/sanity"
import { CardBase } from "components/Cellars/CardBase"
import { Badge, BadgeStatus } from "./Badge"

interface SliderProps extends BoxProps {
  setSliderRef: LegacyRef<Slider>
  data?: StrategyWithImage[]
}

export const SliderStrategy: FC<SliderProps> = ({
  data,
  setSliderRef,
  ...rest
}) => {
  return (
    <Box {...rest}>
      <Slider {...sliderSettings} ref={setSliderRef}>
        {data?.map((strategy) => (
          <CardBase
            key={strategy.title}
            mt={4}
            px={4}
            height={{ base: "23.5rem", sm: "18rem", md: "18.3rem" }}
          >
            <Box pb={4}>
              {
                <Badge
                  status={
                    (strategy.isActive
                      ? "active"
                      : "comingSoon") as BadgeStatus
                  }
                />
              }
            </Box>
            <Heading as="h3" fontSize="2xl" pb={2}>
              {strategy.title}
            </Heading>
            <Box pb={4}>
              <PortableText
                value={strategy.body}
                components={{
                  block: {
                    normal: ({ children }) => (
                      <Text as="p" color="neutral.300" fontSize="md">
                        {children}
                      </Text>
                    ),
                  },
                }}
              />
            </Box>
            <Wrap gap={2}>
              {strategy.stableCoins &&
                strategy.stableCoins.map((coin) => (
                  <Image
                    src={coin.image?.url}
                    alt={coin.name}
                    key={coin.name}
                    boxSize="1.75rem"
                  />
                ))}
            </Wrap>
          </CardBase>
        ))}
      </Slider>
    </Box>
  )
}
