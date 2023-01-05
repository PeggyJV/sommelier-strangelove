import { ColorModeScript } from "@chakra-ui/react"
import { NextPage } from "next"
import { Head, Html, Main, NextScript } from "next/document"
import { config } from "theme/index"

const CustomDocument: NextPage = () => {
  return (
    <Html lang="en">
      <Head>
        {/* eslint-disable-next-line @next/next/next-script-for-ga */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}')
`,
          }}
        />
      </Head>

      <body>
        <ColorModeScript initialColorMode={config.initialColorMode} />
        <Main />
        <NextScript />
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
          }}
        ></noscript>
      </body>
    </Html>
  )
}

export default CustomDocument
