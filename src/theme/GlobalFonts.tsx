import { Global } from "@emotion/react"

export const GlobalFonts = () => (
  <Global
    styles={`
      /* Inter from Google Fonts */
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

      /* Legacy Haffer fonts for backward compatibility */
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
        font-weight: 600;
        font-display: swap;
        src: url('/assets/fonts/HafferXH-SemiBold.woff') format('woff'),
             url('/assets/fonts/HafferXH-SemiBold.woff2') format('woff2');
      }

      @font-face {
        font-family: 'HafferXH';
        font-style: bold;
        font-weight: 700;
        font-display: swap;
        src: url('/assets/fonts/HafferXH-Bold.woff') format('woff'),
             url('/assets/fonts/HafferXH-Bold.woff2') format('woff2');
      }

      @font-face {
        font-family: 'HafferXH';
        font-style: normal;
        font-weight: 900;
        font-display: swap;
        src: url(/assets/fonts/HafferXH-Heavy.woff) format('woff'),
             url(/assets/fonts/HafferXH-Heavy.woff2) format('woff2');
      }
    `}
  />
)
