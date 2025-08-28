import React from "react"

export const ConnectButton = ({
  children,
}: {
  children?: React.ReactNode
}) => (
  <button type="button" role="group">
    {children || "Connect"}
  </button>
)

export default { ConnectButton }
