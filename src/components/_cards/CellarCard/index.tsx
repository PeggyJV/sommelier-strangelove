import { BoxProps, Heading, Spinner } from "@chakra-ui/react"
import {
  CellarCardDisplay,
  CellarCardData,
} from "./CellarCardDisplay"
import { useGetCellarQuery } from "generated/subgraph"
import { cellarDataMap } from "data/cellarDataMap"
import { BigNumber } from "bignumber.js"

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

  const { asset, tvlTotal } = data.cellar

  // const apy = data && averageApy(dayDatas).toFixed(2)
  // const avgTvlActive = averageTvlActive(dayDatas, tvlActive)
  const tvm =
    tvlTotal &&
    asset &&
    new BigNumber(tvlTotal).dividedBy(10 ^ 18).toString()

  const {
    name,
    description,
    strategyType,
    managementFee,
    protocols,
  } = cellarDataMap[cellarAddress]

  const cellarCardData: CellarCardData = {
    cellarId: cellarAddress,
    name,
    description,
    tvm,
    strategyType,
    managementFee,
    protocols,
  }

  return <CellarCardDisplay data={cellarCardData} {...rest} />
}
