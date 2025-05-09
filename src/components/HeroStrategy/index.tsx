import { Stack } from "@chakra-ui/react"
import { FC } from "react"
import { HeroStrategyLeft } from "./hero-left"
import { HeroStrategyRight } from "./hero-right"

interface HeroProps {
  id: string
}

export const HeroStrategy: FC<HeroProps> = ({ id }) => {
  return (
    <Stack
      direction={{
        base: "column",
        md: "row",
      }}
      spacing={12}
    >
      <HeroStrategyLeft id={id} />
      <HeroStrategyRight id={id} />
    </Stack>
  )
}
