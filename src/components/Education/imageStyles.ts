import { EduCardVariant } from "./types"

interface IImageStyle {
  [EduCardVariant: string]: {
    left: string
    bottom?: string
    top?: string
    transform: string
  }
}

export const imageStyles: IImageStyle = {
  [EduCardVariant.Top]: {
    left: "6%",
    top: "-90px",
    transform: "rotate(0deg)",
  },
  [EduCardVariant.Bottom]: {
    left: "30%",
    bottom: "-86px",
    transform: "rotate(180deg)",
  },
  [EduCardVariant.Left]: {
    left: "-76px",
    bottom: "-90px",
    transform: "rotate(180deg)",
  },
}
