import React, { useMemo } from "react"
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion"

export type ThreadCardProps = {
  title: string
  headline: string
  tvl: string
  apy: string
  callouts: { label: string; value: string }[]
  footer: string
  cta: string
}

const fontHeading = {
  fontFamily:
    "HafferXH, -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica Neue, Roboto, sans-serif",
}
const fontBody = {
  fontFamily:
    "Haffer, -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica Neue, Roboto, sans-serif",
}

const parseNum = (s: string) =>
  parseFloat(String(s).replace(/[^\d.]/g, "") || "0")

export const AlphaStatCardThread: React.FC<ThreadCardProps> = ({
  title,
  headline,
  tvl,
  apy,
  callouts,
  footer,
  cta,
}) => {
  const frame = useCurrentFrame()
  const { width, height, durationInFrames } = useVideoConfig()

  // Background drift to keep motion subtle and loop-friendly
  const driftX = interpolate(frame, [0, durationInFrames], [0, -18], {
    easing: Easing.inOut(Easing.cubic),
  })
  const driftY = interpolate(frame, [0, durationInFrames], [0, -12], {
    easing: Easing.inOut(Easing.cubic),
  })

  // Header fade in
  const headerProgress = interpolate(frame, [0, 20], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateRight: "clamp",
  })
  const headerY = interpolate(headerProgress, [0, 1], [14, 0])

  // Count-ups
  const tvlTarget = useMemo(() => parseNum(tvl), [tvl])
  const apyTarget = useMemo(() => parseNum(apy), [apy])

  const tvlProgress = interpolate(frame, [16, 64], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const apyProgress = interpolate(frame, [28, 80], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })

  const tvlDisplay = useMemo(() => {
    const isM = /m/i.test(tvl)
    const value = tvlTarget * tvlProgress
    return `$${isM ? value.toFixed(2) + "M" : value.toFixed(2)}`
  }, [tvl, tvlTarget, tvlProgress])

  const apyDisplay = useMemo(() => {
    const value = apyTarget * apyProgress
    return `${value.toFixed(1)}%`
  }, [apyTarget, apyProgress])

  // Footer + CTA
  const footerProgress = interpolate(frame, [160, 200], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const footerY = interpolate(footerProgress, [0, 1], [28, 0])

  const ctaProgress = interpolate(frame, [136, 184], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const ctaY = interpolate(ctaProgress, [0, 1], [20, 0])

  // Utilization callouts
  const calloutProgress = interpolate(frame, [64, 112], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(80% 60% at 50% 40%, rgba(130,78,255,0.35) 0%, rgba(16,10,24,0.85) 48%, rgba(6,6,10,1) 100%)",
        overflow: "hidden",
        width,
        height,
      }}
    >
      {/* Starfield texture (subtle) */}
      <AbsoluteFill
        style={{
          transform: `translate3d(${driftX}px, ${driftY}px, 0)`,
          opacity: 0.25,
          mixBlendMode: "screen",
        }}
      >
        <Img src={staticFile("assets/icons/defi-stars.png")} />
      </AbsoluteFill>

      {/* Header */}
      <AbsoluteFill
        style={{
          ...fontHeading,
          color: "#FFFFFF",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          paddingTop: 48,
          textAlign: "center",
          opacity: headerProgress,
          transform: `translateY(${headerY}px)`,
        }}
      >
        <div>
          <div style={{ fontWeight: 900, fontSize: 56 }}>{title}</div>
          <div
            style={{
              ...fontBody,
              marginTop: 10,
              color: "#D8D6E2",
              fontWeight: 600,
              fontSize: 26,
            }}
          >
            {headline}
          </div>
        </div>
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
            textShadow: "0 0 16px rgba(130,78,255,0.35)",
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
            color: "rgba(255,255,255,0.95)",
          }}
        >
          Net APY {apyDisplay}
        </div>
      </AbsoluteFill>

      {/* Utilization callouts */}
      <AbsoluteFill
        style={{
          left: "auto",
          right: 48,
          top: "50%",
          transform: `translateY(-50%)`,
          width: 320,
          opacity: calloutProgress,
        }}
      >
        {callouts.slice(0, 3).map((c, i) => (
          <div
            key={c.label}
            style={{
              ...fontBody,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 16px",
              marginBottom: 14,
              borderRadius: 12,
              color: "#FFFFFF",
              background:
                "linear-gradient(180deg, rgba(40,28,68,0.85) 0%, rgba(26,18,40,0.85) 100%)",
              border: "1px solid rgba(180,160,255,0.22)",
              boxShadow: "0 8px 30px rgba(0,0,0,0.35)",
            }}
          >
            <span style={{ opacity: 0.9 }}>{c.label}</span>
            <span style={{ fontWeight: 700 }}>{c.value}</span>
          </div>
        ))}
      </AbsoluteFill>

      {/* CTA */}
      <AbsoluteFill
        style={{
          bottom: 92,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: ctaProgress,
          transform: `translateY(${ctaY}px)`,
        }}
      >
        <div
          style={{
            ...fontBody,
            display: "inline-block",
            color: "#FFFFFF",
            background:
              "linear-gradient(90deg, rgba(130,78,255,0.25) 0%, rgba(76,57,160,0.25) 100%)",
            border: "1px solid rgba(180,160,255,0.35)",
            padding: "10px 16px",
            borderRadius: 999,
            fontSize: 20,
            fontWeight: 600,
          }}
        >
          {cta}
        </div>
      </AbsoluteFill>

      {/* Footer */}
      <AbsoluteFill
        style={{
          bottom: 40,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: footerProgress,
          transform: `translateY(${footerY}px)`,
        }}
      >
        <div style={{ ...fontBody, color: "#D9D7E0", fontSize: 22 }}>
          {footer}
        </div>
      </AbsoluteFill>

      {/* Bottom accent */}
      <AbsoluteFill
        style={{
          bottom: 0,
          left: 0,
          right: 0,
          height: 6,
          background:
            "linear-gradient(90deg, rgba(130,78,255,1) 0%, rgba(58,35,158,1) 50%, rgba(130,78,255,1) 100%)",
          opacity: 0.9,
        }}
      />
    </AbsoluteFill>
  )
}
