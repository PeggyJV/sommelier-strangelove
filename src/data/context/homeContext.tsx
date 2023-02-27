import { FC, useState, createContext, useContext } from "react"

export type Timeline = {
  value: "daily" | "weekly" | "monthly" | "allTime"
  title: "1D" | "1W" | "1M" | "All"
}

type HomeContextType = {
  timeArray: {
    title: string
    value: string
    onClick: () => void
  }[]
  timeline: Timeline
}

const HomeContext = createContext<HomeContextType | null>(null)

export const HomeProvider: FC = ({ children }) => {
  const [state, setState] = useState<Timeline>({
    value: "daily",
    title: "1D",
  })

  const timeArray = [
    {
      title: "1D",
      value: "daily",
      onClick: () =>
        setState({
          title: "1D",
          value: "daily",
        }),
    },
    {
      title: "1W",
      value: "weekly",
      onClick: () =>
        setState({
          title: "1W",
          value: "weekly",
        }),
    },
    {
      title: "1M",
      value: "monthly",
      onClick: () =>
        setState({
          title: "1M",
          value: "monthly",
        }),
    },
    {
      title: "All",
      value: "allTime",
      onClick: () =>
        setState({
          title: "All",
          value: "allTime",
        }),
    },
  ]

  return (
    <HomeContext.Provider
      value={{
        timeArray,
        timeline: state,
      }}
    >
      {children}
    </HomeContext.Provider>
  )
}

export const useHome = () => {
  const context = useContext(HomeContext)

  if (context === null) {
    throw new Error("This hook must be used within a HomeProvider.")
  }

  return context
}
