import React from "react"
import { Player } from "remotion"
import { AlphaStatCardMotion } from "./AlphaStatCardMotion"

export const Compositions: React.FC = () => {
  return (
    <Player
      component={AlphaStatCardMotion}
      compositionWidth={1200}
      compositionHeight={675}
      fps={24}
      durationInFrames={192}
      inputProps={{
        tvl: "250M",
        apy: "12.3",
        cta: "app.somm.finance",
      }}
      controls
    />
  )
}
