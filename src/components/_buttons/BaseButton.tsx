import {
  Button,
  ButtonProps,
  forwardRef,
  Icon,
  IconProps,
} from "@chakra-ui/react"

export interface BaseButtonProps extends Omit<ButtonProps, "icon"> {
  icon?: any
  iconProps?: IconProps
}

export const BaseButton = forwardRef<BaseButtonProps, "button">(
  ({ icon, variant, iconProps, ...rest }, ref) => {
    return (
      <Button
        ref={ref}
        role="group"
        py={2}
        px={4}
        color="text.primary"
        bg="brand.primary"
        borderWidth={2}
        borderColor="brand.primary"
        borderRadius="md"
        fontWeight="semibold"
        overflow="hidden"
        rightIcon={
          icon && (
            <Icon
              as={icon}
              color="brand.background"
              bgColor="text.primary"
              borderRadius="full"
              boxSize={5}
              p={1}
              _groupHover={{
                color: "brand.primary",
                bgColor: "text.primary",
              }}
              {...iconProps}
            />
          )
        }
        isDisabled={rest.disabled}
        _hover={{
          color: "text.primary",
          bg: "brand.secondary",
          borderColor: "brand.secondary",
        }}
        _disabled={{
          color: "text.secondary",
          bg: "brand.surface",
          borderColor: "border.subtle",
          cursor: "auto",
          _hover: {
            color: "text.secondary",
            bg: "brand.surface",
          },
          _active: {
            bg: "brand.surface",
            borderColor: "border.subtle",
          },
        }}
        {...rest}
      />
    )
  }
)
