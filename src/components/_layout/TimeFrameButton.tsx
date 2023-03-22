import { Button, HStack } from "@chakra-ui/react"
import { useHome } from "data/context/homeContext"
import { useEffect, useState } from "react"

export const TimeFrameButton = ({
  containerHeight,
}: {
  containerHeight: number
}) => {
  const { timeArray, timeline } = useHome()
  const [isFixed, setIsFixed] = useState(true)
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      const stopPosition = containerHeight - 140

      if (scrollPosition <= stopPosition) {
        setIsFixed(true)
      } else {
        setIsFixed(false)
      }
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [containerHeight])

  return (
    <HStack
      w="17rem"
      h="20"
      bg="surface.blackTransparent"
      mx="auto"
      my={8}
      backdropFilter="blur(8px)"
      justifyContent="center"
      rounded="100px"
      boxShadow="2xl"
      zIndex={999}
      position={isFixed ? "fixed" : "unset"}
      top={isFixed ? "85vh" : containerHeight}
      bottom={0}
      right={0}
      left={0}
    >
      {timeArray.map((button) => {
        const { title, onClick, value } = button
        const isSelected = value === timeline.value

        return (
          <Button
            key={value}
            color="white"
            fontWeight={600}
            fontSize="1rem"
            px={4}
            py={1}
            rounded="100px"
            bg={isSelected ? "surface.quartnerary" : "none"}
            backdropFilter="blur(8px)"
            borderColor={
              isSelected ? "purple.dark" : "surface.quartnerary"
            }
            _hover={{
              bg: isSelected ? "surface.quartnerary" : "none",
            }}
            _active={{
              bg: isSelected ? "surface.quartnerary" : "none",
            }}
            borderWidth={isSelected ? 2 : 0}
            onClick={onClick}
          >
            {title}
          </Button>
        )
      })}
    </HStack>
  )
}
