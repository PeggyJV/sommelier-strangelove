import { ButtonProps, useTabs } from "@chakra-ui/react"
import { SecondaryButton } from "components/_buttons/SecondaryButton"
import { forwardRef } from "react"

export const CustomTab = forwardRef<HTMLButtonElement, ButtonProps>(
  function CustomTab(props, ref) {
    const tabProps = useTabs({
      ...props,
      ref: ref,
    })

    const isSelected = !!tabProps["aria-selected"]

    return (
      <SecondaryButton
        borderWidth={!isSelected ? 0 : 2}
        borderRadius={16}
        size="lg"
        backgroundColor="surface.tertiary"
        flex={1}
        {...tabProps}
      />
    )
  }
)

CustomTab.displayName = "CustomTab"
