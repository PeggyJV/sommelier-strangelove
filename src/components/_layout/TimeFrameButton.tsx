import { Button, HStack } from "@chakra-ui/react"
import { useHome } from "data/context/homeContext"

export const TimeFrameButton = () => {
  const { timeArray, timeline } = useHome()
  return (
    <HStack
      w="17rem"
      h="20"
      bg="surface.blackTransparent"
      mx="auto"
      mt={-4}
      backdropFilter="blur(8px)"
      justifyContent="center"
      rounded="100px"
      boxShadow="2xl"
    >
      {timeArray.map((button, i) => {
        const { title, onClick, value } = button
        const isSelected = value === timeline.value

        return (
          <Button
            key={i}
            variant="unstyled"
            color="white"
            fontWeight={600}
            fontSize="1rem"
            p={4}
            py={1}
            rounded="100px"
            bg={isSelected ? "surface.primary" : "none"}
            backdropFilter="blur(8px)"
            borderColor={
              isSelected ? "purple.dark" : "surface.tertiary"
            }
            borderWidth={isSelected ? 1 : 0}
            onClick={() => {
              onClick()
            }}
          >
            {title}
          </Button>
        )
      })}
    </HStack>
  )
}
