import type { NextPage } from "next"
import { PageHome } from "components/_pages/PageHome"
import { useState, useEffect } from "react"

const Home: NextPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    setIsModalOpen(true)
  }, [])

  return (
    <>
      <PageHome />
    </>
  )
}

export default Home
