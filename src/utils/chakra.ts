export const connectorSchemes: Record<string, string> = {
  metamask: 'orange'
}

export const getConnectorScheme = (name: string) => {
  return connectorSchemes[name.toLowerCase()]
}
