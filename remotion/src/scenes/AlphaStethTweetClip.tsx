import React, { useMemo } from "react"
import {
  AbsoluteFill,
  Easing,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion"

export type TweetProps = { tvl: string; apy: string }

const parseNum = (s: string) =>
  parseFloat(String(s).replace(/[^\d.]/g, "") || "0")
const formatMillions = (x: number) =>
  x >= 1000 ? `${(x / 1000).toFixed(2)}B` : `${x.toFixed(2)}M`

const CountUpText: React.FC<{
  value: number
  target: number
  decimals?: number
  prefix?: string
  suffix?: string
  style?: React.CSSProperties
}> = ({
  value,
  target,
  decimals = 1,
  prefix = "",
  suffix = "",
  style,
}) => {
  const frame = useCurrentFrame()
  const prog = interpolate(frame, [0, 24], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const current = value + (target - value) * prog
  const txt = `${prefix}${current.toFixed(decimals)}${suffix}`
  return <div style={style}>{txt}</div>
}

export const AlphaStethTweetClip: React.FC<TweetProps> = ({
  tvl,
  apy,
}) => {
  const frame = useCurrentFrame()
  const { durationInFrames, width, height } = useVideoConfig()

  // Background slow drift
  const driftX = interpolate(frame, [0, durationInFrames], [0, -24], {
    easing: Easing.inOut(Easing.cubic),
  })
  const driftY = interpolate(frame, [0, durationInFrames], [0, -16], {
    easing: Easing.inOut(Easing.cubic),
  })

  // Scene A: 0–36  (slower spring, correct casing, visible at frame 0)
  const logoIn = spring({
    frame,
    fps: 24,
    config: { stiffness: 90, damping: 20, mass: 0.9 },
    durationInFrames: 24,
  })
  const logoScale = interpolate(logoIn, [0, 1], [0.85, 1.0])
  // Start partially visible at frame 0 so first frame is not empty
  const logoOpacity = interpolate(frame, [0, 6, 24], [0.35, 0.8, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const glowOpacity = interpolate(
    frame,
    [0, 12, 36],
    [0.2, 0.35, 0.25]
  )

  // Scene B: 36–96 orbit
  const orbitStart = 36
  const orbitP = (delay: number) =>
    interpolate(
      frame,
      [orbitStart + delay, orbitStart + delay + 24],
      [0, 1],
      {
        easing: Easing.out(Easing.cubic),
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }
    )
  const orbitScale = (p: number) => interpolate(p, [0, 1], [0.9, 1])

  // Scene C: 96–156 flow
  const flowStart = 96
  const sC = (start: number, from: number, to: number) =>
    interpolate(
      frame,
      [flowStart + start, flowStart + start + 24],
      [from, to],
      {
        easing: Easing.out(Easing.cubic),
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }
    )
  const arrowGlow = (start: number) => {
    const p = interpolate(
      frame,
      [flowStart + start, flowStart + start + 8],
      [0, 1],
      {
        easing: Easing.inOut(Easing.quad),
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }
    )
    return p
  }

  // Flow layout math (row and positions)
  const CIRCLE = 128
  const rowY = Math.round(height / 2 - CIRCLE / 1.6)
  const SAFE = 90
  const arrowW = 56
  const items = 4
  const arrows = items - 1
  const totalCircles = items * CIRCLE
  const totalArrows = arrows * arrowW
  const free = width - SAFE * 2 - totalCircles - totalArrows
  const gap = free / (items + arrows - 1)
  const x0 = SAFE
  const x1 = x0 + CIRCLE + gap + arrowW + gap
  const x2 = x1 + CIRCLE + gap + arrowW + gap
  const x3 = x2 + CIRCLE + gap + arrowW + gap
  const a0 = x0 + CIRCLE + gap
  const a1 = x1 + CIRCLE + gap
  const a2 = x2 + CIRCLE + gap

  // Scene D: 156–216 stats
  const statsStart = 156
  const tvlNum = useMemo(() => parseNum(tvl), [tvl])
  const apyNum = useMemo(() => parseNum(apy), [apy])
  const tvlProg = interpolate(
    frame,
    [statsStart, statsStart + 28],
    [0, 1],
    {
      easing: Easing.out(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  )
  const tvlGlow =
    frame < statsStart + 26
      ? 0
      : interpolate(
          frame,
          [statsStart + 26, statsStart + 32, statsStart + 38],
          [0, 1, 0],
          { easing: Easing.inOut(Easing.quad) }
        )
  const tvlScale = interpolate(
    frame,
    [statsStart + 26, statsStart + 40],
    [1.02, 1.0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  )
  const apyProg = interpolate(
    frame,
    [statsStart + 16, statsStart + 56],
    [0, 1],
    {
      easing: Easing.out(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  )

  // Scene E: 240–288 brand lock
  const lockStart = 240
  const iconsDim = interpolate(
    frame,
    [lockStart, lockStart + 12],
    [1, 0.2],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  )
  const footerIn = interpolate(
    frame,
    [lockStart + 6, lockStart + 24],
    [0, 1],
    {
      easing: Easing.out(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  )
  const footerPulse =
    0.3 + 0.2 * Math.sin(((frame - lockStart) / 48) * Math.PI * 2)

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {/* Background */}
      <AbsoluteFill
        style={{
          backgroundImage: `url(${staticFile(
            "assets/social/post_assets/backgrounds/backgfround_clean.svg"
          )})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transform: `translate(${driftX}px, ${driftY}px)`,
        }}
      ></AbsoluteFill>

      {/* Persistent Somm logo (always visible, bottom center) */}
      <AbsoluteFill style={{ pointerEvents: "none" }} aria-hidden>
        <img
          src={staticFile("assets/social/post_assets/somm_logo.svg")}
          alt="Somm"
          style={{
            position: "absolute",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            width: 150,
            height: "auto",
            opacity: 0.92,
            filter: "drop-shadow(0 0 8px rgba(130,78,255,0.35))",
          }}
        />
      </AbsoluteFill>

      {/* Scene A */}
      <Sequence from={0} durationInFrames={36}>
        <AbsoluteFill
          style={{ display: "grid", placeItems: "center" }}
        >
          {/* Soft vignette and rings for depth */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(70% 55% at 50% 42%, rgba(130,78,255,0.18) 0%, rgba(18,14,24,0.65) 50%, rgba(0,0,0,0.85) 100%)",
              mixBlendMode: "screen",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              width: 380,
              height: 380,
              borderRadius: 999,
              boxShadow:
                "0 0 80px 20px rgba(130,78,255,0.18), inset 0 0 120px rgba(130,78,255,0.12)",
              opacity: glowOpacity,
              filter: "blur(12px)",
            }}
          />
          {/* Heading: Alpha STETH (from small to big, top center) */}
          <div
            style={{
              position: "absolute",
              top: 72,
              left: "50%",
              transform: `translateX(-50%) scale(${logoScale})`,
              opacity: logoOpacity,
              color: "#fff",
              fontFamily: "Inter, Plus Jakarta Sans, system-ui",
              fontWeight: 800,
              fontSize: 58,
              letterSpacing: 0.2,
              textAlign: "center",
            }}
          >
            Alpha STETH
          </div>
          {/* Sub-strap appears early and softly */}
          <div
            style={{
              position: "absolute",
              top: 132,
              left: "50%",
              transform: "translateX(-50%)",
              color: "rgba(255,255,255,0.92)",
              fontFamily: "Inter, Plus Jakarta Sans, system-ui",
              fontWeight: 600,
              fontSize: 22,
              letterSpacing: 0.2,
              opacity: interpolate(
                frame,
                [0, 10, 24],
                [0.0, 0.6, 1.0]
              ),
            }}
          >
            ETH yield on Base
          </div>
          <img
            src={staticFile(
              "assets/social/post_assets/alphastETH.png"
            )}
            alt="Alpha STETH"
            style={{
              width: 320,
              height: "auto",
              transform: `scale(${logoScale})`,
              opacity: logoOpacity,
            }}
          />
        </AbsoluteFill>
      </Sequence>
      {/* Scene B: Orbit 36–96  adds stETH, wstETH, WETH with slow drift and caption */}
      <Sequence from={36} durationInFrames={60}>
        {(() => {
          const f = frame - 36
          const t = Math.max(0, Math.min(1, f / 60))
          const centerX = width / 2
          const centerY = height / 2
          const R = 140
          const slow = 0.35
          const circleWrap: React.CSSProperties = {
            width: 128,
            height: 128,
            borderRadius: 128,
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.12)",
            display: "grid",
            placeItems: "center",
            boxShadow: "0 10px 40px rgba(0,0,0,0.45)",
            position: "absolute",
          }
          const pos = (ang: number) => ({
            x: centerX + Math.cos(ang + slow * t) * R - 64,
            y: centerY + Math.sin(ang + slow * t) * R - 64,
          })
          const p1 = pos(0.0) // stETH first
          const p2 = pos(2.1) // wstETH second
          const p3 = pos(4.2) // WETH third
          return (
            <>
              <div style={{ ...circleWrap, left: p1.x, top: p1.y }}>
                <img
                  src={staticFile(
                    "assets/social/post_assets/strategy-assets/steth.png"
                  )}
                  alt="stETH"
                  style={{
                    width: 104,
                    height: 104,
                    objectFit: "contain",
                  }}
                />
              </div>
              <div style={{ ...circleWrap, left: p2.x, top: p2.y }}>
                <div
                  style={{
                    width: 104,
                    height: 104,
                    borderRadius: 999,
                    overflow: "hidden",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <img
                    src={staticFile(
                      // Prefer transparent PNG if available; fallback is JPEG
                      "assets/icons/wsteth.png"
                    )}
                    alt="wstETH"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              </div>
              <div style={{ ...circleWrap, left: p3.x, top: p3.y }}>
                <img
                  src={staticFile(
                    "assets/social/post_assets/strategy-assets/weth.png"
                  )}
                  alt="WETH"
                  style={{
                    width: 104,
                    height: 104,
                    objectFit: "contain",
                  }}
                />
              </div>
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  bottom: 84,
                  transform: "translateX(-50%)",
                  color: "#fff",
                  fontFamily: "Inter, Plus Jakarta Sans, system-ui",
                  fontWeight: 700,
                  fontSize: 28,
                  opacity: interpolate(frame, [42, 54], [0, 1]),
                }}
              >
                Putting stETH to work
              </div>
            </>
          )
        })()}
      </Sequence>
      {/* Scene C flow */}
      <Sequence from={96} durationInFrames={60}>
        <AbsoluteFill style={{ opacity: iconsDim }}>
          {/* Layout constants reused from above */}
          {/* ETH circle */}
          <div
            style={{
              position: "absolute",
              top: rowY,
              left: sC(0, x0 - 40, x0),
              width: 128,
              height: 128,
              borderRadius: 128,
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.12)",
              display: "grid",
              placeItems: "center",
              boxShadow: "0 10px 40px rgba(0,0,0,0.45)",
            }}
          >
            <img
              src={staticFile(
                "assets/social/post_assets/strategy-assets/weth.png"
              )}
              alt="ETH"
              style={{
                width: 104,
                height: 104,
                objectFit: "contain",
              }}
            />
          </div>

          {/* Arrow 1 */}
          <img
            src={staticFile(
              "assets/social/post_assets/elements/right_arrow.png"
            )}
            alt="arrow"
            style={{
              position: "absolute",
              top: rowY + 128 / 2 - 9,
              left: a0,
              width: arrowW,
              height: "auto",
              opacity: arrowGlow(20),
              filter: `drop-shadow(0 0 ${
                6 * arrowGlow(20)
              }px rgba(160,120,255,${0.6 * arrowGlow(20)}))`,
            }}
          />

          {/* stETH circle */}
          <div
            style={{
              position: "absolute",
              top: rowY,
              left: sC(16, x1 - 40, x1),
              width: 128,
              height: 128,
              borderRadius: 128,
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.12)",
              display: "grid",
              placeItems: "center",
              boxShadow: "0 10px 40px rgba(0,0,0,0.45)",
            }}
          >
            <img
              src={staticFile(
                "assets/social/post_assets/strategy-assets/steth.png"
              )}
              alt="stETH"
              style={{
                width: 104,
                height: 104,
                objectFit: "contain",
              }}
            />
          </div>

          {/* Arrow 2 */}
          <img
            src={staticFile(
              "assets/social/post_assets/elements/right_arrow.png"
            )}
            alt="arrow"
            style={{
              position: "absolute",
              top: rowY + 128 / 2 - 9,
              left: a1,
              width: arrowW,
              height: "auto",
              opacity: arrowGlow(32),
              filter: `drop-shadow(0 0 ${
                6 * arrowGlow(32)
              }px rgba(160,120,255,${0.6 * arrowGlow(32)}))`,
            }}
          />

          {/* Alpha STETH circle */}
          <div
            style={{
              position: "absolute",
              top: rowY,
              left: sC(28, x2 - 40, x2),
              width: 128,
              height: 128,
              borderRadius: 128,
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.12)",
              display: "grid",
              placeItems: "center",
              boxShadow: "0 10px 40px rgba(0,0,0,0.45)",
            }}
          >
            <img
              src={staticFile(
                "assets/social/post_assets/alphastETH.png"
              )}
              alt="Alpha STETH"
              style={{
                width: 110,
                height: 110,
                objectFit: "contain",
              }}
            />
          </div>

          {/* Arrow 3 */}
          <img
            src={staticFile(
              "assets/social/post_assets/elements/right_arrow.png"
            )}
            alt="arrow"
            style={{
              position: "absolute",
              top: rowY + 128 / 2 - 9,
              left: a2,
              width: arrowW,
              height: "auto",
              opacity: arrowGlow(44),
              filter: `drop-shadow(0 0 ${
                6 * arrowGlow(44)
              }px rgba(160,120,255,${0.6 * arrowGlow(44)}))`,
            }}
          />

          {/* Aave + Base together in one big circle */}
          <div
            style={{
              position: "absolute",
              top: rowY,
              left: sC(36, x3 - 40, x3),
              width: 128,
              height: 128,
              borderRadius: 128,
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              boxShadow: "0 10px 40px rgba(0,0,0,0.45)",
              padding: 12,
            }}
          >
            <img
              src={staticFile(
                "assets/social/post_assets/protocols/aave.png"
              )}
              alt="Aave"
              style={{
                width: 48,
                height: 48,
                objectFit: "contain",
              }}
            />
            <img
              src={staticFile(
                "assets/social/post_assets/chains/base.png"
              )}
              alt="Base"
              style={{
                width: 48,
                height: 48,
                objectFit: "contain",
              }}
            />
          </div>

          <div
            style={{
              position: "absolute",
              left: "50%",
              bottom: 80,
              transform: "translateX(-50%)",
              color: "#fff",
              fontFamily: "Inter, Plus Jakarta Sans, system-ui",
              fontWeight: 700,
              fontSize: 26,
              opacity: interpolate(frame, [120, 132], [0, 1]),
            }}
          >
            ETH yield where retail lives
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Scene D stats */}
      <Sequence from={156} durationInFrames={60}>
        <AbsoluteFill
          style={{ display: "grid", placeItems: "center" }}
        >
          <div
            style={{
              textAlign: "center",
              color: "white",
              filter: `drop-shadow(0 10px 24px rgba(0,0,0,0.35))`,
            }}
          >
            <div
              style={{
                fontFamily: "Inter, Plus Jakarta Sans, system-ui",
                fontWeight: 900,
                fontSize: 100,
                transform: `scale(${tvlScale})`,
                textShadow: `0 0 ${
                  8 + tvlGlow * 8
                }px rgba(130,78,255,${0.25 + tvlGlow * 0.55})`,
              }}
            >
              TVL ${formatMillions(tvlNum * tvlProg)}
            </div>
            <CountUpText
              value={0}
              target={apyNum}
              decimals={1}
              prefix={"Net APY "}
              suffix={"%"}
              style={{
                marginTop: 12,
                fontFamily: "Inter, Plus Jakarta Sans, system-ui",
                fontWeight: 750,
                fontSize: 60,
                textAlign: "center",
                color: "rgba(255,255,255,0.95)",
              }}
            />
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Scene E brand lock (centered, longer, with subtle glow pulse) */}
      <Sequence from={240} durationInFrames={48}>
        <AbsoluteFill
          style={{
            textAlign: "center",
            color: "rgba(255,255,255,0.92)",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: `translate(-50%, -50%) scale(${
                1 + footerPulse * 0.02
              })`,
              fontFamily: "Inter, Plus Jakarta Sans, system-ui",
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: 0.2,
              opacity: footerIn,
              textShadow: `0 0 ${
                8 + footerPulse * 12
              }px rgba(130,78,255,${0.25 + footerPulse * 0.4})`,
            }}
          >
            Backed by Lido, Deployed on Aave, Morpho, Balancer
          </div>
          {/* Protocol logos below the line */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, calc(-50% + 56px))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 18,
              opacity: footerIn,
              filter: `drop-shadow(0 0 ${
                6 + footerPulse * 10
              }px rgba(130,78,255,${0.25 + footerPulse * 0.35}))`,
            }}
          >
            <img
              src={staticFile(
                "assets/social/post_assets/protocols/lido.png"
              )}
              alt="Lido"
              style={{ width: 42, height: 42, objectFit: "contain" }}
            />
            <img
              src={staticFile(
                "assets/social/post_assets/protocols/aave.png"
              )}
              alt="Aave"
              style={{ width: 42, height: 42, objectFit: "contain" }}
            />
            <img
              src={staticFile(
                "assets/social/post_assets/protocols/morpho.png"
              )}
              alt="Morpho"
              style={{ width: 42, height: 42, objectFit: "contain" }}
            />
            <img
              src={staticFile(
                "assets/social/post_assets/protocols/balancer.png"
              )}
              alt="Balancer"
              style={{ width: 42, height: 42, objectFit: "contain" }}
            />
          </div>
          {/* Somm logo is persistent globally. Optionally dim it during footer: */}
          <div
            style={{
              position: "absolute",
              bottom: 24,
              left: "50%",
              transform: "translateX(-50%)",
              width: 150,
              height: 0,
            }}
          >
            {/* If you want to dim the global Somm in this window, wrap persistent render with frame-based opacity. */}
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  )
}
