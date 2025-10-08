import React, { useMemo } from "react"
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion"

export type AlphaStatCardProps = {
  tvl: string
  apy: string
  cta?: string
}

const CANVAS = { w: 1200, h: 675 }
const parseNumber = (s: string) =>
  parseFloat(String(s).replace(/[^\d.]/g, "") || "0")
const formatMillions = (x: number) =>
  x >= 1000 ? `${(x / 1000).toFixed(2)}B` : `${x.toFixed(2)}M`

export const AlphaStatCardMotion: React.FC<AlphaStatCardProps> = ({
  tvl,
  apy,
  cta,
}) => {
  const frame = useCurrentFrame()
  const { fps, durationInFrames } = useVideoConfig()

  const tvlIsMillions = /m/i.test(tvl)
  const tvlNum = useMemo(() => parseNumber(tvl), [tvl])
  const apyNum = useMemo(() => parseNumber(apy), [apy])

  const driftX = interpolate(frame, [0, durationInFrames], [0, -24], {
    easing: Easing.inOut(Easing.cubic),
  })
  const driftY = interpolate(frame, [0, durationInFrames], [0, -16], {
    easing: Easing.inOut(Easing.cubic),
  })

  const headerIn = spring({
    frame,
    fps,
    config: { stiffness: 140, damping: 18, mass: 0.7 },
    durationInFrames: 18,
  })
  const headerOpacity = interpolate(headerIn, [0, 1], [0, 1])
  const headerY = interpolate(headerIn, [0, 1], [18, 0])

  const tvlProgress = interpolate(frame, [10, 50], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const tvlScale = interpolate(tvlProgress, [0, 1], [0.98, 1])
  const tvlGlow =
    frame < 48
      ? 0
      : interpolate(frame, [48, 52, 56], [0, 1, 0], {
          easing: Easing.inOut(Easing.quad),
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
  const tvlDisplayVal = useMemo(() => {
    const current = tvlNum * tvlProgress
    return tvlIsMillions
      ? formatMillions(current)
      : `$${current.toFixed(2)}`
  }, [tvlNum, tvlProgress, tvlIsMillions])

  const apyProgress = interpolate(frame, [32, 76], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const apyDisplayVal = useMemo(
    () => (apyNum * apyProgress).toFixed(1),
    [apyNum, apyProgress]
  )
  const apyY = interpolate(apyProgress, [0, 1], [22, 0])
  const apyScale = interpolate(apyProgress, [0, 1], [0.98, 1])

  const footerProgress = interpolate(frame, [96, 132], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const footerY = interpolate(footerProgress, [0, 1], [20, 0])
  const footerOpacity = footerProgress

  const gradient: React.CSSProperties = {
    width: CANVAS.w,
    height: CANVAS.h,
    background:
      "radial-gradient(80% 60% at 50% 40%, rgba(130,78,255,0.35) 0%, rgba(26,18,40,0.7) 45%, rgba(6,6,10,1) 100%)",
    transform: `translate(${driftX}px, ${driftY}px)`,
  }
  const headerStyle: React.CSSProperties = {
    position: "absolute",
    top: 72,
    left: "50%",
    transform: `translate(-50%, ${headerY}px)`,
    opacity: headerOpacity,
    fontFamily:
      "HafferXH, -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica Neue, Roboto, sans-serif",
    fontWeight: 800,
    fontSize: 54,
    color: "#fff",
  }
  const tvlStyle: React.CSSProperties = {
    position: "absolute",
    top: CANVAS.h / 2 - 36,
    left: "50%",
    transform: `translate(-50%, -50%) scale(${tvlScale})`,
    fontFamily:
      "HafferXH, -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica Neue, Roboto, sans-serif",
    fontWeight: 900,
    fontSize: 104,
    lineHeight: 1.05,
    color: "#fff",
    textShadow: `0 0 ${8 + tvlGlow * 8}px rgba(130,78,255,${
      0.25 + tvlGlow * 0.55
    })`,
    whiteSpace: "pre",
  }
  const apyStyle: React.CSSProperties = {
    position: "absolute",
    top: CANVAS.h / 2 + 64,
    left: "50%",
    transform: `translate(-50%, ${apyY}px) scale(${apyScale})`,
    fontFamily:
      "HafferXH, -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica Neue, Roboto, sans-serif",
    fontWeight: 750,
    fontSize: 66,
    color: "rgba(255,255,255,0.95)",
  }
  const footerWrap: React.CSSProperties = {
    position: "absolute",
    bottom: 56,
    left: "50%",
    transform: `translateX(-50%) translateY(${footerY}px)`,
    opacity: footerOpacity,
    textAlign: "center",
    color: "rgba(255,255,255,0.92)",
    width: "90%",
  }
  const footerText: React.CSSProperties = {
    fontFamily:
      "Haffer, -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica Neue, Roboto, sans-serif",
    fontWeight: 600,
    fontSize: 24,
  }
  const ctaStyle: React.CSSProperties = {
    marginTop: 8,
    fontFamily:
      "Haffer, -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica Neue, Roboto, sans-serif",
    fontSize: 22,
    opacity: 0.9,
  }
  const bottomAccent: React.CSSProperties = {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 6,
    background:
      "linear-gradient(90deg, rgba(130,78,255,1) 0%, rgba(58,35,158,1) 50%, rgba(130,78,255,1) 100%)",
    opacity: 0.9,
  }

  const tvlPrefix = tvlIsMillions ? "$" : ""

  return (
    <div style={gradient}>
      <div style={headerStyle}>Alpha STETH</div>
      <div style={tvlStyle}>
        TVL {tvlPrefix}
        {tvlDisplayVal}
      </div>
      <div style={apyStyle}>Net APY {apyDisplayVal}%</div>
      <div style={footerWrap}>
        <div style={footerText}>
          Backed by Lido, Deployed on Aave, Morpho, Balancer
        </div>
        {cta && <div style={ctaStyle}>{cta}</div>}
      </div>
      <div style={bottomAccent} />
    </div>
  )
}
