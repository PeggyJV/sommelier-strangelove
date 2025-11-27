// Badge.tsx

import { Badge as CBadge, BadgeProps, Text } from "@chakra-ui/react"

export enum BadgeStatus {
  Active = "active",
  ComingSoon = "comingSoon",
  New = "new",
}

interface Props extends BadgeProps {
  status: BadgeStatus
}

const color = {
  [BadgeStatus.Active]: "text.primary",
  [BadgeStatus.ComingSoon]: "text.primary",
  [BadgeStatus.New]: "text.primary",
}

const bg = {
  [BadgeStatus.Active]: "state.success",
  [BadgeStatus.ComingSoon]: "state.warning",
  [BadgeStatus.New]: "brand.primary",
}

export const Badge: React.FC<Props> = ({ status, ...rest }) => {
  const statusString = status.replace(/([A-Z])/g, " $1")
  const finalResult =
    statusString.charAt(0).toUpperCase() + statusString.slice(1)
  return (
    <CBadge
      borderRadius="sm"
      backgroundColor={bg[status]}
      px={2}
      py={0.5}
      {...rest}
    >
      <Text
        fontWeight="semibold"
        textTransform="none"
        color={color[status]}
        fontSize="xs"
      >
        {finalResult}
      </Text>
    </CBadge>
  )
}
