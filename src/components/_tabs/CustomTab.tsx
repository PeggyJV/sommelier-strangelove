import { ButtonProps, forwardRef, useTab } from "@chakra-ui/react"
import { SecondaryButton } from "components/_buttons/SecondaryButton"
import React from "react"

export const CustomTab = forwardRef<ButtonProps, "button">(
  (props, ref) => {
    const tabProps = useTab({
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
