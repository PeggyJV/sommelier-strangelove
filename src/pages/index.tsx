import PageHome from "components/_pages/PageHome"
import Head from "next/head"
import type { NextPage } from "next"

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <meta
          name="facebook-domain-verification"
          content="pnoev5dib5kzx8u5549rltt9zp6f1i"
        />
      </Head>
      <PageHome />
    </div>
  )
}

export default Home
