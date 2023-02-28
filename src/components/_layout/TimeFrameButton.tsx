import { Button, HStack } from "@chakra-ui/react"
import { useHome } from "data/context/homeContext"
import { useScrollDirection } from "hooks/utils/useScrollDirection"
import { useEffect, useState } from "react"

export const TimeFrameButton = ({
  containerHeight,
}: {
  containerHeight?: number
}) => {
  const { timeArray, timeline } = useHome()

  const [scrolled, setScrolled] = useState<boolean>(false)
  const scrollDirection = useScrollDirection()

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (
        window.scrollY >=
        Number(containerHeight) - Number(containerHeight) / 2
      ) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    })
    return () => {
      window.removeEventListener("scroll", () => {})
    }
  }, [containerHeight])

  const hideShow = `timeframe ${
    scrolled && scrollDirection === "down" && "down"
  }`

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
      position="fixed"
      bottom={0}
      right={0}
      left={0}
      zIndex={999}
      className={hideShow}
    >
      {timeArray.map((button) => {
        const { title, onClick, value } = button
        const isSelected = value === timeline.value

        return (
          <Button
            key={value}
            variant="unstyled"
            color="white"
            fontWeight={600}
            fontSize="1rem"
            px={4}
            py={1}
            rounded="100px"
            bg={isSelected ? "surface.primary" : "none"}
            backdropFilter="blur(8px)"
            borderColor={
              isSelected ? "purple.dark" : "surface.tertiary"
            }
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
