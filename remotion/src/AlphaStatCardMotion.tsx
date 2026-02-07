import React from "react"
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion"

type Props = {
  tvl: string
  apy: string
  cta?: string
}

const fontHeading = {
  fontFamily:
    "HafferXH, -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica Neue, Roboto, sans-serif",
}
const fontBody = {
  fontFamily:
    "Haffer, -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica Neue, Roboto, sans-serif",
}

export const AlphaStatCardMotion: React.FC<Props> = ({
  tvl,
  apy,
  cta,
}) => {
  const frame = useCurrentFrame()
  const { width, height, fps } = useVideoConfig()

  // Background drift factor
  const drift = interpolate(frame, [0, 192], [0, 40], {
    easing: Easing.inOut(Easing.ease),
  })

  // Fades
  const headerOpacity = interpolate(frame, [0, 8], [0, 1], {
    easing: Easing.out(Easing.ease),
    extrapolateRight: "clamp",
  })

  // Count-up for numbers (0->1 progress over 28 frames starting at 8)
  const progress = interpolate(frame, [8, 36], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })

  const formatCount = (targetStr: string) => {
    // Simple count-up for leading numeric part, keep suffix like M or %
    const match = targetStr.match(/^(\d+(?:\.\d+)?)(.*)$/)
    if (!match) return targetStr
    const target = parseFloat(match[1])
    const suffix = match[2] || ""
    const current = (target * progress).toFixed(
      match[1].includes(".") ? 1 : 0
    )
    return `${current}${suffix}`
  }

  const tvlDisplay = `$${formatCount(tvl)}`
  const apyDisplay = `${formatCount(apy)}%`

  // Footer slide in last 24 frames
  const footerTranslate = interpolate(frame, [168, 192], [40, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const footerOpacity = interpolate(frame, [168, 180], [0, 1], {
    easing: Easing.out(Easing.ease),
    extrapolateRight: "clamp",
  })

  return (
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(90deg, #0B0F17 0%, #1E163D 50%, #6C4ED9 100%)",
        overflow: "hidden",
        width,
        height,
      }}
    >
      {/* Background image drift using post asset */}
      <AbsoluteFill
        style={{
          transform: `translate3d(${drift}px, ${drift / 2}px, 0)`,
          opacity: 0.9,
        }}
      >
        <Img
          src={staticFile("assets/post_assets/background_1.svg")}
        />
      </AbsoluteFill>

      {/* Header */}
      <AbsoluteFill
        style={{
          ...fontHeading,
          color: "white",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          paddingTop: 60,
          fontWeight: 800,
          fontSize: 72,
          opacity: headerOpacity,
          textAlign: "center",
        }}
      >
        Alpha STETH
      </AbsoluteFill>

      {/* Numbers */}
      <AbsoluteFill
        style={{
          top: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 24,
          color: "white",
          textAlign: "center",
        }}
      >
        <div
          style={{
            ...fontHeading,
            fontWeight: 900,
            fontSize: 104,
            lineHeight: 1,
          }}
        >
          TVL {tvlDisplay}
        </div>
        <div
          style={{
            ...fontHeading,
            fontWeight: 800,
            fontSize: 64,
            lineHeight: 1,
          }}
        >
          Net APY {apyDisplay}
        </div>
      </AbsoluteFill>

      {/* Footer */}
      <AbsoluteFill
        style={{
          bottom: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          flexDirection: "column",
          gap: 16,
          paddingBottom: 48,
          transform: `translateY(${footerTranslate}px)`,
          opacity: footerOpacity,
        }}
      >
        <div style={{ ...fontBody, color: "#D9D7E0", fontSize: 22 }}>
          Backed by Lido • Deployed on Aave, Morpho, Balancer
        </div>
        <Img
          src={staticFile("assets/post_assets/somm_logo.png")}
          style={{ width: 180, height: "auto" }}
        />
      </AbsoluteFill>

      {/* Optional CTA */}
      {cta && (
        <AbsoluteFill
          style={{
            bottom: 0,
            right: 0,
            padding: 24,
            color: "white",
            opacity: 0.9,
          }}
        >
          <div style={{ ...fontBody, fontSize: 20 }}>{cta}</div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  )
}
