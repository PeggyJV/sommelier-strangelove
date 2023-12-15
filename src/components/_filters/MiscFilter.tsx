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

export interface MiscFilterProps {
}

export const MiscFilter: VFC<MiscFilterProps> = (props) => {
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
              <Text fontSize={"1.25em"}>Filter</Text>
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
        borderRadius={2}
        bg="surface.bg"
        fontWeight="semibold"
        _focus={{
          outline: "unset",
          outlineOffset: "unset",
          boxShadow: "unset",
        }}
      >
        <PopoverBody p={0}>
          <Stack></Stack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}
