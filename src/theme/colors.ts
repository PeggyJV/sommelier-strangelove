const electricIndigo = {
  50: "#F5E6FF",
  100: "#DCADFF",
  200: "#C685FF",
  300: "#AD5CFF",
  400: "#9233FF",
  500: "#760BFF",
  600: "#5700D9",
  700: "#4100B3",
  800: "#2F008C",
  900: "#1F0066",
}
const brilliantRose = {
  50: "#FFF0F6",
  100: "#FFEDF5",
  200: "#FFC4E2",
  300: "#FF9CD1",
  400: "#FF73C2",
  500: "#F849B2",
  600: "#D13297",
  700: "#AB207D",
  800: "#851362",
  900: "#5E0C48",
}
const deepSkyBlue = {
  50: "#E6FAFF",
  100: "#A3EAFF",
  200: "#7ADCFF",
  300: "#52CBFF",
  400: "#29B8FF",
  500: "#00A3FF",
  600: "#0082D9",
  700: "#0065B3",
  800: "#004B8C",
  900: "#003366",
}
const brightTurquoise = {
  50: "#E6FFF8",
  100: "#A3FFE8",
  200: "#7AFFE2",
  300: "#52FFDF",
  400: "#27F5D6",
  500: "#00E8CC",
  600: "#00C2B2",
  700: "#009C94",
  800: "#007573",
  900: "#004E4F",
}
const warmPink = "#D3426F"
const burntPink = "#af3b62"
const aubergine = "#43263a"
const transparentPurple = "rgba(96, 80, 155, 0.1)"
const darkPlum = "#322436"
const violentViolet = "#39196d"
const energyYellow = "#F7DF58"
const darkYellow = "#3D3716"
const transparentYellow = "rgba(247, 223, 88, 0.08)"
const sunsetOrange = "#f26057"
const darkOrange = "#3D1816"
const transparentOrange = "rgba(242, 96, 87, 0.08)"
const lime = "#BCE051"
const transparentLime = "rgba(212, 236, 141, 0.08)"
const darkLime = "#373D25"
const turquoise = "#DDFFDE"
const darkTurquoise = "#353D35"
const transparentTurquoise = "rgba(221, 255, 222, 0.08)"
const black = "#1f1f2d"
const offBlack = "#1f1f1d"
const white = "#FFFFFF"
const light = "#FAF6F0"
const functional = {
  primary: energyYellow,
  secondary: deepSkyBlue[500],
  accent: brilliantRose[500],
  warning: "#F2893B",
  caution: "#F5B336",
  danger: "#E92660",
  success: brightTurquoise[500],
  white: white,
}
const backgrounds = {
  white: white,
  black: black,
  offBlack: offBlack,
  light: light,
  brand: energyYellow,
  dark: violentViolet,
  darker: "#1f0b40",
  deepPurple: "#281144",
  glassy: "rgba(96, 80, 155, 0.1)",
  purpleGlassGradient:
    "linear-gradient(180deg, rgba(96, 80, 155, 0.75) 0%, rgba(31, 31, 45, 0.75) 100%)",
  overlayGradient: `linear-gradient(transparent 60%, ${offBlack} 90%)`,
  buttonGradient: `linear-gradient(180deg, transparent, rgba(96, 80, 155, 0.48)), ${warmPink}
  `,
  buttonHoverGradient: `linear-gradient(180deg, transparent, rgba(96, 80, 155, 0.2304)), rgba(211, 66, 111, 0.48);`,
}
const uiChrome = {
  darkest: black,
  light: light,
  dark: violentViolet,
  lightest: white,
  dataBorder: "#655076",
}

const text = {
  headlines: {
    dark: black,
    brand: energyYellow,
    light: white,
  },
  body: {
    light: white,
    lightMuted: "#9F8EB4",
    dark: violentViolet,
    darkMuted: "#836699",
  },
  input: {
    light: white,
    lightMuted: "#9F8EB4",
    dark: "#3D1152",
    darkMuted: "#836699",
  },
}

const surface = {
  primary: "rgba(78, 56, 156, 0.08)",
  tertiary: "rgba(78, 56, 156, 0.24)",
}

const neutral = {
  300: "#D9D7E0",
  800: "#252429",
}

export const colors = {
  electricIndigo,
  brilliantRose,
  deepSkyBlue,
  brightTurquoise,
  violentViolet,
  energyYellow,
  transparentYellow,
  darkYellow,
  sunsetOrange,
  transparentOrange,
  darkOrange,
  lime,
  transparentLime,
  turquoise,
  transparentTurquoise,
  darkTurquoise,
  darkLime,
  warmPink,
  burntPink,
  aubergine,
  darkPlum,
  transparentPurple,
  black,
  offBlack,
  white,
  light,
  functional,
  backgrounds,
  uiChrome,
  text,
  surface,
  neutral,
}
