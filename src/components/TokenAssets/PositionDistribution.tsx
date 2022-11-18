import { Avatar, HStack, Text } from "@chakra-ui/react"
import { VFC } from "react"

interface PositionDistributionProps {
  address?: string
  src?: string
  percentage?: string
}

export const PositionDistribution: VFC<PositionDistributionProps> = ({
  address,
  src,
  percentage,
}) => {
  return (
    <HStack spacing={1} alignItems="center" key={address}>
      <Avatar
        boxSize="24px"
        borderWidth={2}
        borderColor="surface.bg"
        src={src}
        bg="surface.bg"
        _notFirst={{
          opacity: 0.65,
        }}
        _hover={{
          opacity: 1,
        }}
        _groupHover={{
          _first: {
            opacity: 0.65,
          },
        }}
        _first={{
          _hover: {
            opacity: "1 !important",
          },
        }}
      />
      <Text fontSize="0.625rem">{percentage}</Text>
    </HStack>
  )
}
