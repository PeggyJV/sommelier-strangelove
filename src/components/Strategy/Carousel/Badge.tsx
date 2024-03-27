// Badge.tsx

import { Badge as CBadge, BadgeProps, Text } from "@chakra-ui/react"

export enum BadgeStatus {
  Active = "active",
  ComingSoon = "comingSoon",
  New = "new", // Add new status
}

interface Props extends BadgeProps {
  status: BadgeStatus
}

const color = {
  [BadgeStatus.Active]: "lime.base",
  [BadgeStatus.ComingSoon]: "orange.base",
  [BadgeStatus.New]: "white", // Color for text of the New badge
}

const bg = {
  [BadgeStatus.Active]: "lime.dark",
  [BadgeStatus.ComingSoon]: "orange.dark",
  [BadgeStatus.New]: "violet.base", // Background color for the New badge
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
