import {
  Button,
  HStack,
  Image,
  Text,
  Stack,
  Box,
  Popover,
  PopoverTrigger,
  PopoverBody,
  PopoverContent,
  AvatarGroup,
  Avatar,
  Checkbox,
} from "@chakra-ui/react"
import { useState, VFC } from "react"
import { HamburgerIcon } from "components/_icons"

export interface MiscFilterProp {
  name: string
  checked: boolean
  stateSetFunction: (value: boolean) => void
}

export interface MiscFilterProps {
  categories: MiscFilterProp[]
}

export const MiscFilter: VFC<MiscFilterProps> = (props) => {
  const [checkedStates, setCheckedStates] = useState(
    new Map(
      props.categories.map((category) => [
        category.name,
        {
          checked: category.checked,
          stateSetFunction: category.stateSetFunction,
        },
      ])
    )
  )

  const toggleCheck = (id: string) => {
    setCheckedStates((prev) => {
      const newChecked = !prev.get(id)!.checked
      const newCheckedStates = new Map(prev).set(id, {
        checked: newChecked,
        stateSetFunction: prev.get(id)!.stateSetFunction,
      })

      // Using the nullish coalescing operator
      ;(prev.get(id)!.stateSetFunction ?? (() => {}))(newChecked)

      return newCheckedStates
    })
  }


  return (
    <Popover placement="bottom">
      <PopoverTrigger>
        <Button
          bg="none"
          borderWidth={2.5}
          borderColor="purple.base"
          borderRadius="1em"
          w="auto"
          zIndex={401}
          fontFamily="Haffer"
          fontSize={12}
          padding="1.75em 2em"
          _hover={{
            bg: "purple.dark",
          }}
          leftIcon={
            <HStack>
              <Text fontSize={"1.25em"}>Filters</Text>
            </HStack>
          }
          rightIcon={<HamburgerIcon boxSize={3.5} />}
        />
      </PopoverTrigger>

      <PopoverContent
        p={2}
        maxW="max-content"
        borderWidth={1}
        borderColor="purple.dark"
        borderRadius={"1em"}
        bg="surface.bg"
        fontWeight="semibold"
        _focus={{
          outline: "unset",
          outlineOffset: "unset",
          boxShadow: "unset",
        }}
      >
        <PopoverBody p={0}>
          <Stack>
            {props.categories.map((category) => (
              <Box
                as="button"
                key={category.name}
                py={2}
                px={4}
                fontSize="sm"
                borderRadius={6}
                onClick={() => {
                  toggleCheck(category.name)
                }}
                _hover={{
                  cursor: "pointer",
                  bg: "purple.dark",
                  borderColor: "surface.tertiary",
                }}
              >
                <HStack
                  display="flex" // Use flex display
                  justifyContent="space-between" // Space between items
                  alignItems="center" // Align items vertically
                  width="100%" // Full width
                  spacing={3}
                >
                  <Text fontWeight="semibold">{category.name}</Text>{" "}
                  <Checkbox
                    id={category.name}
                    isChecked={
                      checkedStates.get(category.name)!.checked
                    }
                    onChange={(e) => {
                      toggleCheck(category.name)
                    }}
                  />
                </HStack>
              </Box>
            ))}
          </Stack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}
