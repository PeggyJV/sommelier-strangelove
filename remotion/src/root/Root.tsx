import React from "react"
import { Composition } from "remotion"
import {
  AlphaStatCardMotion,
  AlphaStatCardProps,
} from "../scenes/AlphaStatCardMotion"
import { AlphaOneClip, OneClipProps } from "../scenes/AlphaOneClip"
import {
  AlphaStethTweetClip,
  TweetProps,
} from "../scenes/AlphaStethTweetClip"
import {
  AlphaStatCardThread,
  ThreadCardProps,
} from "../scenes/AlphaStatCardThread"

export const Root: React.FC = () => {
  const defaults: AlphaStatCardProps = {
    tvl: "146.34M",
    apy: "4.7",
    cta: "app.somm.finance/strategies/Alpha-stETH/manage",
  }
  const defaultsOneClip: OneClipProps = {
    tvl: "146.34M",
    apy: "4.7",
    cta: "app.somm.finance/strategies/Alpha-stETH/manage",
  }
  return (
    <>
      <Composition
        id="AlphaStatCardMotion"
        component={AlphaStatCardMotion}
        width={1200}
        height={675}
        fps={24}
        durationInFrames={192}
        defaultProps={defaults}
      />
      <Composition
        id="AlphaStatCardThread"
        component={AlphaStatCardThread}
        width={1200}
        height={675}
        fps={24}
        durationInFrames={216}
        defaultProps={
          {
            title: "Alpha STETH",
            headline: "Anchor Thread • Base Utilization",
            tvl: "143.32M",
            apy: "5.8",
            callouts: [
              { label: "WETH", value: "~85%" },
              { label: "wstETH", value: "~37%" },
            ],
            footer:
              "Backed by Lido • Deployed on Aave, Morpho, Balancer",
            cta: "Put stETH to work → somm.finance/Alpha-STETH",
          } as ThreadCardProps
        }
      />
      <Composition
        id="AlphaOneClip"
        component={AlphaOneClip}
        width={1200}
        height={675}
        fps={24}
        durationInFrames={288}
        defaultProps={defaultsOneClip}
      />
      <Composition
        id="AlphaStethTweetClip"
        component={AlphaStethTweetClip}
        width={1200}
        height={675}
        fps={24}
        durationInFrames={288}
        defaultProps={{ tvl: "146.34M", apy: "4.7" } as TweetProps}
      />
    </>
  )
}
