import React from "react"
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  useCurrentFrame,
} from "remotion"
import { AlphaStatCardScene, StatProps } from "./AlphaStatCardScene"
import { L2FlowScene } from "./L2FlowScene"

export type OneClipProps = StatProps

const Crossfade: React.FC<{ start: number; end: number }> = ({
  start,
  end,
}) => {
  const frame = useCurrentFrame()
  const o = interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  return (
    <AbsoluteFill
      style={{
        background: "transparent",
        opacity: 0,
      }}
    />
  )
}

export const AlphaOneClip: React.FC<OneClipProps> = (props) => {
  return (
    <AbsoluteFill>
      {/* A. Stat card 0–144 */}
      <Sequence from={0} durationInFrames={144}>
        <AlphaStatCardScene {...props} />
      </Sequence>

      {/* B. Flow 144–288 */}
      <Sequence from={144} durationInFrames={144}>
        <L2FlowScene />
      </Sequence>

      {/* Soft crossfade overlap, 132–156 */}
      <Sequence from={132} durationInFrames={24}>
        <Crossfade start={132} end={156} />
      </Sequence>
    </AbsoluteFill>
  )
}
