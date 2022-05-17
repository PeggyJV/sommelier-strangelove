import { TabPanelProps, TabProps } from "@chakra-ui/react"

export const tabProps: TabProps = {
  color: "neutral.400",
  fontWeight: "bold",
  _selected: {
    color: "white",
    position: "relative",
    _after: {
      content: '""',
      position: "absolute",
      bottom: -0.75,
      left: 0,
      height: "4px",
      width: "100%",
      bg: "purple.base",
      borderRadius: "2px",
    },
  },
}

export const tabPanelProps: TabPanelProps = {
  px: 0,
  pt: 6,
  maxW: "78ch",
}
