import { useDisclosure } from "@chakra-ui/react"
import { RestrictedModal } from "components/_modals/RestrictedModal"
import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react"

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000/"

type CheckIPState = {
  country: string | null
  region: string | null
  isRestricted: boolean
}

interface CheckIPContext extends CheckIPState {
  isRestrictedAndOpenModal: () => boolean
}

const geoContext = createContext<CheckIPContext | null>(null)

export const GeoProvider: FC<ReactNode> = ({ children }) => {
  const [ctx, setCtx] = useState<CheckIPState>({
    country: null,
    region: null,
    isRestricted: false,
  })
  const restrictedModal = useDisclosure()

  useEffect(() => {
    const getRegionData = async () => {
      const res = await fetch(`${BASE_URL}api/geo`, {
        method: "GET",
      })
      const data = await res.json()
      setCtx(data)
    }

    getRegionData()
  }, [])

  const isRestrictedAndOpenModal = () => {
    if (ctx.isRestricted) {
      restrictedModal.onOpen()
      //   analytics.track("user.modal-access-restricted-opened")
      return true
    }
    return false
  }

  return (
    <geoContext.Provider
      value={{
        ...ctx,
        isRestrictedAndOpenModal,
      }}
    >
      {children}
      <RestrictedModal {...restrictedModal} />
    </geoContext.Provider>
  )
}

export const useGeo = () => useContext(geoContext)
