import { protocolsImage } from "./protocolsImagePath"

export const getProtocols = (protocols: string) => {
  return {
    title: protocols,
    icon: protocolsImage[protocols],
  }
}
