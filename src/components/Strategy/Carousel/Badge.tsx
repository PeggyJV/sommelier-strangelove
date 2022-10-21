import { Badge as CBadge, BadgeProps, Text } from "@chakra-ui/react"

export enum BadgeStatus {
  Active = "active",
  ComingSoon = "comingSoon",
}

interface Props extends BadgeProps {
  status: BadgeStatus
}

const color = {
  [BadgeStatus.Active]: "lime.base",
  [BadgeStatus.ComingSoon]: "orange.base",
}

const bg = {
  [BadgeStatus.Active]: "lime.dark",
  [BadgeStatus.ComingSoon]: "orange.dark",
}

export const Badge: React.FC<Props> = ({ status, ...rest }) => {
  const statusString = status.replace(/([A-Z])/g, " $1")
  const finalResult =
    statusString.charAt(0).toUpperCase() + statusString.slice(1)
  return (
    <CBadge borderRadius={4} backgroundColor={bg[status]} {...rest}>
      <Text
        fontWeight="normal"
        textTransform="none"
        color={color[status]}
      >
        {finalResult}
      </Text>
    </CBadge>
  )
}
