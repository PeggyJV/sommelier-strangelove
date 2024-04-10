// src/pages/index.tsx
import type { NextPage } from "next"
import React, { useState, useEffect } from "react"
import { PageHome } from "../components/_pages/PageHome" // Adjust the import path as necessary
import SnapshotNotifyModal from "../components/_modals/SnapshotNotifyModal" // Adjust the import path as necessary

const Home: NextPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(true) // Default to true for testing

  useEffect(() => {
    // Uncomment below for actual usage outside testing
    /*
    const modalShown = localStorage.getItem("modalShown");
    if (!modalShown) {
      setIsModalOpen(true);
      localStorage.setItem("modalShown", "true");
    }
    */
  }, [])

  const handleCloseModal = () => {
    setIsModalOpen(false)
    // Uncomment below if you want to reset modalShown flag in localStorage after closing the modal
    // localStorage.setItem("modalShown", "true");
  }

  return (
    <>
      <PageHome />
      <SnapshotNotifyModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  )
}

export default Home
