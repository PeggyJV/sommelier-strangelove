import { Stack } from "@chakra-ui/react"
import { VFC } from "react"
import { HeroStrategyLeft } from "./hero-left"
import { HeroStrategyRight } from "./hero-right"

interface HeroProps {
  id: string
}

export const HeroStrategy: VFC<HeroProps> = ({ id }) => {
  return (
    <Stack direction="row" spacing={12}>
      <HeroStrategyLeft id={id} />
      <HeroStrategyRight id={id} />
    </Stack>
  )
}
