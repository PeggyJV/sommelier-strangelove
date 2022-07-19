import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react"

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
      const res = await fetch("http://localhost:3000/api/geo", {
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
