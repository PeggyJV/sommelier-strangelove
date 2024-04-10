import type { NextPage } from "next"
import { PageHome } from "components/_pages/PageHome"
import { useState, useEffect } from "react"
// import { SnapshotNotifyModal } from "components/_modals/SnapshotNotifyModal"

const Home: NextPage = () => {
  // const [isModalOpen, setIsModalOpen] = useState(false)

  // useEffect(() => {
  //   const modalShown = localStorage.getItem("modalShown")
  //   if (!modalShown) {
  //     setIsModalOpen(true)
  //     localStorage.setItem("modalShown", "true")
  //   }
  // }, [])

  // const handleCloseModal = () => setIsModalOpen(false)

  return (
    <>
      <PageHome />
      {/* {isModalOpen && (
        <SnapshotNotifyModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )} */}
    </>
  )
}

export default Home
