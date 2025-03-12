// regenerate by running
// npx @chakra-ui/cli tokens path/to/your/theme.(js|ts)
import { BaseThemeTypings } from "./shared.types.js"
export interface ThemeTypings extends BaseThemeTypings {
  blur: string & {}
  borders: string & {}
  borderStyles: string & {}
  borderWidths: string & {}
  breakpoints:
    | "values"
    | "conditions.sm"
    | "conditions.smOnly"
    | "conditions.smDown"
    | "conditions.md"
    | "conditions.mdOnly"
    | "conditions.mdDown"
    | "conditions.lg"
    | "conditions.lgOnly"
    | "conditions.lgDown"
    | "conditions.xl"
    | "conditions.xlOnly"
    | "conditions.xlDown"
    | "conditions.2xl"
    | "conditions.2xlOnly"
    | "conditions.2xlDown"
    | "conditions.smToMd"
    | "conditions.smToLg"
    | "conditions.smToXl"
    | "conditions.smTo2xl"
    | "conditions.mdToLg"
    | "conditions.mdToXl"
    | "conditions.mdTo2xl"
    | "conditions.lgToXl"
    | "conditions.lgTo2xl"
    | "conditions.xlTo2xl"
    | (string & {})
  colors: string & {}
  colorSchemes: string & {}
  fonts: string & {}
  fontSizes: string & {}
  fontWeights: string & {}
  layerStyles: string & {}
  letterSpacings: string & {}
  lineHeights: string & {}
  radii: string & {}
  shadows: string & {}
  sizes: string & {}
  space: string & {}
  zIndices: string & {}
  textStyles: string & {}
  transition: string & {}
  components: {}
}
