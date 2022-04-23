import { BoxProps } from "@chakra-ui/react"
import { Card } from "components/_cards/Card"

interface CellarCardProps extends BoxProps {
  data?: any
  isPlaceholder?: boolean
  index?: number
}

export const CellarCard: React.FC<CellarCardProps> = ({
  data,
  ...rest
}) => {
  console.log("data", data)
  return (
    <Card border="8px solid rgba(78, 56, 156, 0.08)" {...rest}>
      Card
    </Card>
  )
}
