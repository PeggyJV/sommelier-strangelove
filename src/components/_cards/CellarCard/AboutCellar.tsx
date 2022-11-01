import { Text } from "@chakra-ui/react"
import { CellarCardData } from "./CellarCardDisplay"

import { Stats } from "./Stats"
import { ValueManaged } from "./ValueManaged"

interface Props {
  data: CellarCardData
}

export const AboutCellar: React.FC<Props> = ({ data }) => {
  return (
    <>
      <ValueManaged ml={2} mr={2} cellarId={data.cellarId} />
      <Text my={4} ml={2} mr={2}>
        {data.description}
      </Text>
      <Stats
        data={data}
        bg="surface.secondary"
        borderWidth={1}
        borderColor="surface.tertiary"
      />
    </>
  )
}
