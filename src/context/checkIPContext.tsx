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

const checkIPContext = createContext<CheckIPContext | null>(null)

export const CheckIPProvider: FC<ReactNode> = ({ children }) => {
  const [ctx, setCtx] = useState<CheckIPContext>()

  useEffect(() => {
    const getRegionData = async () => {
      const res = await fetch("http://localhost:3000/api/test-geo", {
        method: "GET",
      })
      const data = await res.json()
      setCtx(data)
    }

    getRegionData()
  }, [])

  return (
    <checkIPContext.Provider value={ctx}>
      {children}
    </checkIPContext.Provider>
  )
}

export const useCheckIP = () => useContext(checkIPContext)
