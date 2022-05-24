import { BoxProps, Heading, Spinner } from "@chakra-ui/react"
import {
  CellarCardDisplay,
  CellarCardData,
} from "./CellarCardDisplay"
import { useGetCellarQuery } from "generated/subgraph"
import { cellarDataMap } from "data/cellarDataMap"
import { averageApy, averageTvlActive } from "utils/cellarApy"
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

  const { asset, dayDatas, tvlActive, tvlTotal } = data.cellar

  const apy = data && averageApy(dayDatas).toFixed(2)
  const tvm =
    tvlTotal &&
    asset &&
    new BigNumber(tvlTotal).dividedBy(10 ^ asset?.decimals).toString()

  const avgTvlActive = averageTvlActive(dayDatas, tvlActive)

  const cellarCardData: CellarCardData = {
    cellarId: cellarAddress,
    name: cellarDataMap[cellarAddress].name,
    description: cellarDataMap[cellarAddress].description,
    tvm: "",
    strategyType: cellarDataMap[cellarAddress].strategyType,
    // managementFee: `${parseFloat(data.cellar.feePlatform) * 100}%`,
    managementFee: cellarDataMap[cellarAddress].managementFee,
    protocols: cellarDataMap[cellarAddress].protocols,
    apy,
  }

  return <CellarCardDisplay data={cellarCardData} {...rest} />
}
