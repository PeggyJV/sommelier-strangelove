import { BoxProps } from "@chakra-ui/react"
import {
  CellarCardDisplay,
  CellarCardData,
} from "./CellarCardDisplay"
import { cellarDataMap } from "data/cellarDataMap"

interface CellarCardProps extends BoxProps {
  cellarAddress: string
}

export const CellarCard: React.FC<CellarCardProps> = ({
  cellarAddress,
  ...rest
}) => {
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
    strategyType,
    managementFee,
    protocols,
  }

  return <CellarCardDisplay data={cellarCardData} {...rest} />
}
