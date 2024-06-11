import {
  Button,
  ButtonProps,
  forwardRef,
  Icon,
  IconProps,
} from "@chakra-ui/react"
import { VFC } from "react"

export interface BaseButtonProps extends Omit<ButtonProps, "icon"> {
  icon?: any
  iconProps?: IconProps
}

export const BaseButton = forwardRef<
  BaseButtonProps,
  "button"
>(({ icon, variant, iconProps, ...rest }, ref) => {
  return (
    <Button
      ref={ref}
      role="group"
      py={2}
      px={4}
      color="white"
      bg="gradient.primary"
      borderWidth={2}
      borderColor="purple.base"
      overflow="hidden"
      rightIcon={
        icon && (
          <Icon
            as={icon}
            color="surface.bg"
            bgColor="white"
            borderRadius="50%"
            boxSize={5}
            p={1}
            _groupHover={{
              color: "purple.dark",
              bgColor: "white",
            }}
            {...iconProps}
          />
        )
      }
      isDisabled={rest.disabled}
      _hover={{
        color: "white",
        bg: "purple.dark",
      }}
      _disabled={{
        color: "neutral.400",
        bg: "purple.dark",
        borderColor: "purple.dark",
        cursor: "auto",
        _hover: {
          color: "neutral.400",
        },
        _active: {
          bg: "purple.dark",
          borderColor: "purple.dark",
        },
      }}
      {...rest}
    />
  )
})
