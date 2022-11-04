import { Text } from "@chakra-ui/react"
import { cellarDataMap } from "data/cellarDataMap"
import { isTokenPriceEnabled, isTVMEnabled } from "data/uiConfig"
import { CellarCardData } from "./CellarCardDisplay"

import { Stats } from "./Stats"
import { TokenPrice } from "./TokenPrice"
import { ValueManaged } from "./ValueManaged"

interface Props {
  data: CellarCardData
}

export const AboutCellar: React.FC<Props> = ({ data }) => {
  const cellarConfig = cellarDataMap[data.cellarId].config
  return (
    <>
      {isTVMEnabled(cellarConfig) && (
        <ValueManaged ml={2} mr={2} cellarId={data.cellarId} />
      )}
      {isTokenPriceEnabled(cellarConfig) && (
        <TokenPrice ml={2} mr={2} cellarId={data.cellarId} />
      )}
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
