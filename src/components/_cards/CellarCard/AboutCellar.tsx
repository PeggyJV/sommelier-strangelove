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
      <ValueManaged ml={2} mr={2} />
      <Text mb={6} mt={6} ml={2} mr={2}>
        {data.description}
      </Text>
      <Stats mb={2} data={data} />
    </>
  )
}
