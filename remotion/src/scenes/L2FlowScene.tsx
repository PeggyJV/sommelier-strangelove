import React from "react"
import {
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion"

const CIRCLE = 128 // circle diameter
const PADDING = 12 // inner padding for logos
const LABEL_SIZE = 22

type Item = { label: string; src: string }

const CircleItem: React.FC<{
  x: number
  y: number
  item: Item
  start: number
}> = ({ x, y, item, start }) => {
  const frame = useCurrentFrame()
  const p = interpolate(frame, [start, start + 18], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const dy = interpolate(p, [0, 1], [18, 0])
  const o = p

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: CIRCLE,
        textAlign: "center",
        transform: `translateY(${dy}px)`,
        opacity: o,
      }}
    >
      <div
        style={{
          width: CIRCLE,
          height: CIRCLE,
          borderRadius: CIRCLE,
          background: "rgba(255,255,255,0.04)",
          boxShadow: "0 10px 40px rgba(0,0,0,0.45)",
          border: "1px solid rgba(255,255,255,0.12)",
          display: "grid",
          placeItems: "center",
        }}
      >
        <img
          src={item.src}
          alt={item.label}
          style={{
            width: CIRCLE - PADDING * 2,
            height: CIRCLE - PADDING * 2,
            objectFit: "contain",
          }}
        />
      </div>
      <div
        style={{
          marginTop: 10,
          color: "#fff",
          fontFamily: "Inter, Plus Jakarta Sans, system-ui",
          fontWeight: 700,
          fontSize: LABEL_SIZE,
        }}
      >
        {item.label}
      </div>
    </div>
  )
}

const Arrow: React.FC<{
  x: number
  y: number
  w: number
  start: number
}> = ({ x, y, w, start }) => {
  const frame = useCurrentFrame()
  const p = interpolate(frame, [start, start + 10], [0, 1], {
    easing: Easing.inOut(Easing.quad),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const o = p
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y + CIRCLE / 2 - 3,
        width: w,
        height: 6,
        borderRadius: 3,
        background: `linear-gradient(90deg, rgba(255,255,255,${
          0.2 + 0.6 * o
        }) 0%, rgba(180,160,255,${0.2 + 0.6 * o}) 100%)`,
        boxShadow: `0 0 ${6 * o}px rgba(160,120,255,${0.6 * o})`,
      }}
    />
  )
}

export const L2FlowScene: React.FC = () => {
  const frame = useCurrentFrame()
  const { width, height } = useVideoConfig()

  // Layout math
  const SAFE = 72 // side margins
  const ITEMS = 4 // ETH, stETH, Alpha, Aave(Base)
  const ARROWS = ITEMS - 1
  const arrowWidth = 56
  const totalCircles = ITEMS * CIRCLE
  const totalArrows = ARROWS * arrowWidth
  const free = width - SAFE * 2 - totalCircles - totalArrows
  const gap = free / (ITEMS + ARROWS - 1) // gaps between every element

  // Baseline
  const rowY = Math.round(height / 2 - CIRCLE / 1.4)

  // X positions for circles and arrows
  const x0 = SAFE
  const x1 = x0 + CIRCLE + gap + arrowWidth + gap
  const x2 = x1 + CIRCLE + gap + arrowWidth + gap
  const x3 = x2 + CIRCLE + gap + arrowWidth + gap

  const a0 = x0 + CIRCLE + gap // arrow 1 x
  const a1 = x1 + CIRCLE + gap // arrow 2 x
  const a2 = x2 + CIRCLE + gap // arrow 3 x

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundImage:
          "url(/assets/social/post_assets/backgrounds/background_2.svg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <CircleItem
        x={x0}
        y={rowY}
        start={0}
        item={{
          label: "ETH",
          src: "/assets/social/post_assets/strategy-assets/weth.png",
        }}
      />
      <Arrow x={a0} y={rowY} w={arrowWidth} start={12} />

      <CircleItem
        x={x1}
        y={rowY}
        start={24}
        item={{
          label: "stETH",
          src: "/assets/social/post_assets/strategy-assets/steth.png",
        }}
      />
      <Arrow x={a1} y={rowY} w={arrowWidth} start={36} />

      <CircleItem
        x={x2}
        y={rowY}
        start={48}
        item={{
          label: "Alpha STETH",
          src: "/assets/social/post_assets/alphastETH.png",
        }}
      />
      <Arrow x={a2} y={rowY} w={arrowWidth} start={60} />

      <CircleItem
        x={x3}
        y={rowY}
        start={72}
        item={{
          label: "Aave (Base)",
          src: "/assets/social/post_assets/protocols/aave.png",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: 80,
          transform: "translateX(-50%)",
          color: "#fff",
          fontFamily: "Inter, Plus Jakarta Sans, system-ui",
          fontWeight: 700,
          fontSize: 28,
        }}
      >
        ETH yield where retail lives
      </div>
    </div>
  )
}
