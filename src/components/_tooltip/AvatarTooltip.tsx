import { Avatar, chakra, HStack, Text } from "@chakra-ui/react"
import { Token } from "data/tokenConfig"
import { Variants, motion } from "framer-motion"
import { FC } from "react"
import { getProtocols } from "utils/getProtocols"

type AvatarTooltipProps = {
  protocols?: string[]
  tradedAssets?: Token[]
}

export const scale: Variants = {
  exit: {
    scale: 0.85,
    opacity: 0,
    transition: {
      opacity: { duration: 0.15, easings: "easeInOut" },
      scale: { duration: 0.2, easings: "easeInOut" },
    },
  },
  enter: {
    scale: 1,
    opacity: 1,
    transition: {
      opacity: { easings: "easeOut", duration: 0.2 },
      scale: { duration: 0.2, ease: [0.175, 0.885, 0.4, 1.1] },
    },
  },
}

export const AvatarTooltip: FC<AvatarTooltipProps> = ({
  protocols,
  tradedAssets,
}) => {
  const MotionDiv = chakra(motion.div)
  return (
    <MotionDiv
      initial="exit"
      animate="enter"
      exit="exit"
      variants={scale}
      position="absolute"
      bg="neutral.900"
      py="4"
      px="6"
      boxShadow="xl"
      zIndex={10}
      display="flex"
      flexDir="column"
      gap={3}
      rounded="lg"
      mt={10}
    >
      {protocols &&
        protocols.map((protocol: string) => {
          const data = getProtocols(protocol)
          return (
            <HStack key={protocol}>
              <Avatar
                name={data.title}
                src={data.icon}
                key={data.title}
                bgColor="white"
                size="sm"
              />
              <Text fontSize="12px" fontWeight={600}>
                {data.title}
              </Text>
            </HStack>
          )
        })}
      {tradedAssets &&
        tradedAssets.map(({ symbol, src }: Token) => {
          return (
            <HStack key={symbol}>
              <Avatar
                name={symbol}
                src={src}
                key={symbol}
                bgColor="white"
                size="sm"
              />
              <Text fontSize="12px" fontWeight={600}>
                {symbol}
              </Text>
            </HStack>
          )
        })}
    </MotionDiv>
  )
}
