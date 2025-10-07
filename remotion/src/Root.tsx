import React from "react"
import { Composition } from "remotion"
import { AlphaStatCardMotion } from "./AlphaStatCardMotion"

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="AlphaStatCardMotion"
        component={AlphaStatCardMotion}
        width={1200}
        height={675}
        fps={24}
        durationInFrames={192}
        defaultProps={{
          tvl: "250M",
          apy: "12.3",
          cta: "app.somm.finance",
        }}
      />
    </>
  )
}
