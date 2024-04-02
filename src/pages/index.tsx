import type { NextPage } from "next"
import { PageHome } from "components/_pages/PageHome"
import { SnapshotNotifyModal } from "components/_modals/SnapshotNotifyModal"
import { useState, useEffect } from "react"

const Home: NextPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    // Here you can add logic to show the modal based on certain conditions.
    // For demonstration, we'll show it every time the page is loaded.
    setIsModalOpen(true)
  }, [])

  return (
    <>
      <PageHome />
      <SnapshotNotifyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}

export default Home
