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

// In browser, prefer relative path to avoid CORS in dev when running on non-default ports
const BASE_URL =
  typeof window === "undefined"
    ? process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000/"
    : "/"

type CheckIPState = {
  country: string | null
  region: string | null
  isRestricted: boolean
}

interface CheckIPContext extends CheckIPState {
  isRestrictedAndOpenModal: () => boolean
}

const geoContext = createContext<CheckIPContext | null>(null)

export const GeoProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [ctx, setCtx] = useState<CheckIPState>({
    country: null,
    region: null,
    isRestricted: false,
  })
  const restrictedModal = useDisclosure()

  useEffect(() => {
    const getRegionData = async () => {
      try {
        const res = await fetch(`${BASE_URL}api/geo`, {
          method: "GET",
        })

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }

        const data = await res.json()
        setCtx(data)
      } catch (error) {
        console.warn("Failed to fetch geo data:", error)
        // Set default values when geo data fetch fails
        setCtx({
          country: null,
          region: null,
          isRestricted: false,
        })
      }
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
