import { BoxProps, Heading, Spinner } from "@chakra-ui/react"
import {
  CellarCardDisplay,
  CellarCardData,
} from "./CellarCardDisplay"
import { useGetCellarQuery } from "generated/subgraph"
import { cellarDataMap } from "data/cellarDataMap"
import { averageApy } from "utils/cellarApy"

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

  const apy = data && averageApy(data.cellar.dayDatas).toFixed(2)

  const cellarCardData: CellarCardData = {
    name: cellarDataMap[cellarAddress].name,
    description: cellarDataMap[cellarAddress].description,
    tvm: "",
    strategyType: cellarDataMap[cellarAddress].strategyType,
    // managementFee: `${parseFloat(data.cellar.feePlatform) * 100}%`,
    managementFee: "1%",
    protocols: cellarDataMap[cellarAddress].protocols,
    apy,
  }

  return <CellarCardDisplay data={cellarCardData} {...rest} />
}
