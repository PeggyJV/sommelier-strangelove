import React, { useMemo } from "react"
import {
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion"

export type StatProps = { tvl: string; apy: string; cta?: string }

const parseNum = (s: string) =>
  parseFloat(String(s).replace(/[^\d.]/g, "") || "0")

export const AlphaStatCardScene: React.FC<StatProps> = ({
  tvl,
  apy,
  cta,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const tvlNum = useMemo(() => parseNum(tvl), [tvl])
  const apyNum = useMemo(() => parseNum(apy), [apy])

  // Header
  const headerIn = spring({
    frame,
    fps,
    config: { stiffness: 140, damping: 18 },
  })
  const headerY = interpolate(headerIn, [0, 1], [16, 0])
  const headerO = interpolate(headerIn, [0, 1], [0, 1])

  // TVL
  const tvlProg = interpolate(frame, [12, 60], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const tvlGlow =
    frame < 58
      ? 0
      : interpolate(frame, [58, 64, 70], [0, 1, 0], {
          easing: Easing.inOut(Easing.quad),
        })
  const tvlScale = interpolate(tvlProg, [0, 1], [0.98, 1.0])
  const tvlDisplay = useMemo(() => {
    const v = tvlNum * tvlProg
    return `${v.toFixed(2)}M`
  }, [tvlNum, tvlProg])

  // APY
  const apyProg = interpolate(frame, [34, 96], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const apyY = interpolate(apyProg, [0, 1], [24, 0])
  const apyScale = interpolate(apyProg, [0, 1], [0.98, 1.0])
  const apyDisplay = useMemo(
    () => (apyNum * apyProg).toFixed(1),
    [apyNum, apyProg]
  )

  // Footer
  const footerProg = interpolate(frame, [110, 140], [0, 1], {
    easing: Easing.out(Easing.cubic),
  })
  const footerY = interpolate(footerProg, [0, 1], [20, 0])
  const footerO = footerProg

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundImage: "url(/assets/post_assets/background_2.svg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 70,
          left: "50%",
          transform: `translate(-50%, ${headerY}px)`,
          opacity: headerO,
          fontFamily:
            "HafferXH, -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica Neue, Roboto, sans-serif",
          fontWeight: 800,
          fontSize: 54,
          color: "#fff",
        }}
      >
        Alpha STETH
      </div>

      <div
        style={{
          position: "absolute",
          top: 300,
          left: "50%",
          transform: `translate(-50%, -50%) scale(${tvlScale})`,
          fontFamily:
            "HafferXH, -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica Neue, Roboto, sans-serif",
          fontWeight: 900,
          fontSize: 104,
          color: "#fff",
          textShadow: `0 0 ${8 + tvlGlow * 8}px rgba(130,78,255,${
            0.25 + tvlGlow * 0.55
          })`,
        }}
      >
        TVL ${tvlDisplay}
      </div>

      <div
        style={{
          position: "absolute",
          top: 380,
          left: "50%",
          transform: `translate(-50%, ${apyY}px) scale(${apyScale})`,
          fontFamily:
            "HafferXH, -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica Neue, Roboto, sans-serif",
          fontWeight: 750,
          fontSize: 66,
          color: "rgba(255,255,255,0.95)",
        }}
      >
        Net APY {apyDisplay}%
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 64,
          left: "50%",
          transform: `translate(-50%, ${footerY}px)`,
          opacity: footerO,
          textAlign: "center",
          color: "rgba(255,255,255,0.92)",
          width: "90%",
          fontFamily:
            "Haffer, -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica Neue, Roboto, sans-serif",
        }}
      >
        <div style={{ fontSize: 24, fontWeight: 600 }}>
          Backed by Lido, Deployed on Aave, Morpho, Balancer
        </div>
        {cta && (
          <div style={{ marginTop: 8, fontSize: 22 }}>{cta}</div>
        )}
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 6,
          background:
            "linear-gradient(90deg, rgba(130,78,255,1) 0%, rgba(58,35,158,1) 50%, rgba(130,78,255,1) 100%)",
        }}
      />
    </div>
  )
}
