import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react"

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

type CheckIPContext =
  | {
      country: string
      region: string
      isRestricted: boolean
    }
  | undefined

const geoContext = createContext<CheckIPContext | null>(null)

export const GeoProvider: FC<ReactNode> = ({ children }) => {
  const [ctx, setCtx] = useState<CheckIPContext>()

  useEffect(() => {
    const getRegionData = async () => {
      const res = await fetch(`${BASE_URL}/api/geo`, {
        method: "GET",
      })
      const data = await res.json()
      setCtx(data)
    }

    getRegionData()
  }, [])

  return (
    <geoContext.Provider value={ctx}>{children}</geoContext.Provider>
  )
}

export const useGeo = () => useContext(geoContext)
