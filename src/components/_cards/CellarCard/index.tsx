import { BoxProps, Heading, Spinner } from "@chakra-ui/react"
import {
  CellarCardDisplay,
  CellarCardData,
} from "./CellarCardDisplay"
import { useGetCellarQuery } from "generated/subgraph"
import { cellarDataMap } from "src/data/cellarDataMap"
import { formatApy } from "utils/formatApy"

interface CellarCardProps extends BoxProps {
  cellarAddress: string
  index?: number
}

export const CellarCard: React.FC<CellarCardProps> = ({
  cellarAddress,
  index,
  ...rest
}) => {
  const [cellarResult] = useGetCellarQuery({
    variables: {
      cellarAddress,
      cellarString: cellarAddress,
    },
  })

  const { data, fetching } = cellarResult

  if (fetching) {
    return <Spinner />
  }

  if (data?.cellar === null || data?.cellar === undefined) {
    return <Heading>Cellar not found</Heading>
  }

  const cellarCardData: CellarCardData = {
    name: cellarDataMap[cellarAddress].name,
    description: cellarDataMap[cellarAddress].description,
    tvm: "",
    strategyType: cellarDataMap[cellarAddress].strategyType,
    managementFee: `${parseFloat(data.cellar.feePlatform) * 100}%`,
    protocols: cellarDataMap[cellarAddress].protocols,
    apy: formatApy(data.cellar.apy)!,
  }

  return <CellarCardDisplay data={cellarCardData} {...rest} />
}
