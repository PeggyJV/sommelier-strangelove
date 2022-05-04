import { Stack, StackProps, useMediaQuery } from "@chakra-ui/react"
import { useMemo, VFC } from "react"
import { CardDivider } from "./_layout/CardDivider"

export const CardStatRow: VFC<StackProps> = (props) => {
  const [isLessThan594] = useMediaQuery("(max-width: 594px)")

  const portfolioMarginInline = useMemo(() => {
    if (props.id !== "portfolio") return

    return isLessThan594 ? undefined : "auto !important"
  }, [props.id, isLessThan594])

  const portfolioMarginY = useMemo(() => {
    if (props.id !== "portfolio") return

    return isLessThan594 ? "1.5rem !important" : undefined
  }, [props.id, isLessThan594])

  return (
    <Stack
      spacing={3}
      justify="space-around"
      divider={
        <CardDivider
          marginInline={portfolioMarginInline}
          my={portfolioMarginY}
        />
      }
      {...props}
    />
  )
}
