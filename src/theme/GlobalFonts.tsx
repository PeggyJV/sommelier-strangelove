import { Global } from "@emotion/react"

export const GlobalFonts = () => (
  <Global
    styles={`
      @font-face {
        font-family: 'Haffer';
        font-style: normal;
        font-weight: 400;
        font-display: swap;
        src: url('/assets/fonts/Haffer-Regular.woff') format('woff'),
             url('/assets/fonts/Haffer-Regular.woff2') format('woff2');
      }

      @font-face {
        font-family: 'Haffer';
        font-style: bold;
        font-weight: 700;
        font-display: swap;
        src: url('/assets/fonts/Haffer-Bold.woff') format('woff'),
             url('/assets/fonts/Haffer-Bold.woff2') format('woff2');
      }

      @font-face {
        font-family: 'HafferXH';
        font-style: normal;
        font-weight: 400;
        font-display: swap;
        src: url('/assets/fonts/HafferXH-Regular.woff') format('woff'),
             url('/assets/fonts/HafferXH-Regular.woff2') format('woff2');
      }

      @font-face {
        font-family: 'HafferXH';
        font-style: bold;
        font-weight: 700;
        font-display: swap;
        src: url('/assets/fonts/HafferXH-Bold.woff') format('woff'),
             url('/assets/fonts/HafferXH-Bold.woff2') format('woff2');
      }
    `}
  />
)
