import React, { useEffect, useState } from "react"
import { LineSvgProps, LineSeries } from "@nivo/line"

type ResponsiveLineComponent = (
  props: Omit<LineSvgProps<LineSeries>, "width" | "height">
) => React.JSX.Element

// Define a comprehensive default theme for nivo charts
const defaultNivoTheme = {
  background: "transparent",
  text: {
    fontSize: 11,
    fill: "#EDEBF5",
    outlineWidth: 0,
    outlineColor: "transparent",
  },
  axis: {
    domain: {
      line: {
        stroke: "#EDEBF5",
        strokeWidth: 1,
      },
    },
    legend: {
      text: {
        fontSize: 12,
        fill: "#EDEBF5",
        outlineWidth: 0,
        outlineColor: "transparent",
      },
    },
    ticks: {
      line: {
        stroke: "#EDEBF5",
        strokeWidth: 1,
      },
      text: {
        fontSize: 11,
        fill: "#EDEBF5",
        outlineWidth: 0,
        outlineColor: "transparent",
      },
    },
  },
  grid: {
    line: {
      stroke: "#2D2545",
      strokeWidth: 1,
    },
  },
  legends: {
    title: {
      text: {
        fontSize: 11,
        fill: "#EDEBF5",
        outlineWidth: 0,
        outlineColor: "transparent",
      },
    },
    text: {
      fontSize: 11,
      fill: "#EDEBF5",
      outlineWidth: 0,
      outlineColor: "transparent",
    },
    ticks: {
      line: {},
      text: {
        fontSize: 10,
        fill: "#EDEBF5",
        outlineWidth: 0,
        outlineColor: "transparent",
      },
    },
  },
  annotations: {
    text: {
      fontSize: 13,
      fill: "#EDEBF5",
      outlineWidth: 2,
      outlineColor: "#ffffff",
      outlineOpacity: 1,
    },
    link: {
      stroke: "#000000",
      strokeWidth: 1,
      outlineWidth: 2,
      outlineColor: "#ffffff",
      outlineOpacity: 1,
    },
    outline: {
      stroke: "#000000",
      strokeWidth: 2,
      outlineWidth: 2,
      outlineColor: "#ffffff",
      outlineOpacity: 1,
    },
    symbol: {
      fill: "#000000",
      outlineWidth: 2,
      outlineColor: "#ffffff",
      outlineOpacity: 1,
    },
  },
  tooltip: {
    wrapper: {},
    container: {
      background: "#1B0F2E",
      fontSize: 12,
      color: "#EDEBF5",
      padding: "12px",
      borderRadius: "4px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    },
    basic: {},
    chip: {},
    table: {},
    tableCell: {},
    tableCellValue: {},
  },
  crosshair: {
    line: {
      stroke: "#EDEBF5",
      strokeWidth: 1,
      strokeOpacity: 0.35,
    },
  },
  dots: {
    text: {
      fontSize: 12,
      fill: "#EDEBF5",
    },
  },
  markers: {
    lineColor: "#EDEBF5",
    lineStrokeWidth: 1,
    text: {
      fontSize: 11,
      fill: "#EDEBF5",
    },
  },
}

const SafeLineChart = ({
  data,
  theme,
  ...rest
}: LineSvgProps<LineSeries>) => {
  const [mounted, setMounted] = useState(false)
  const [ResponsiveLine, setResponsiveLine] =
    useState<ResponsiveLineComponent | null>(null)

  useEffect(() => {
    setMounted(true)
    // Dynamically import ResponsiveLine only on client side
    import("@nivo/line").then(module => {
      setResponsiveLine(() => module.ResponsiveLine)
    }).catch(err => {
      console.error("Failed to load nivo line chart:", err)
    })
  }, [])

  // Don't render anything on server or before mount
  if (!mounted || !ResponsiveLine) {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#666'
      }}>
        Loading chart...
      </div>
    )
  }

  // Return null if no data
  if (!data || data.length === 0) {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#666'
      }}>
        No data available
      </div>
    )
  }

  // Merge provided theme with defaults
  const chartTheme = {
    ...defaultNivoTheme,
    ...(theme || {}),
  }

  try {
    return (
      <ResponsiveLine
        data={data}
        theme={chartTheme as LineSvgProps<LineSeries>["theme"]}
        useMesh
        enableGridX={false}
        enableGridY={false}
        motionConfig="default"
        enablePoints={false}
        pointLabelYOffset={0}
        lineWidth={2}
        {...rest}
      />
    )
  } catch (error) {
    console.error("Error rendering line chart:", error)
    return (
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ff6666'
      }}>
        Error loading chart
      </div>
    )
  }
}

export default SafeLineChart
