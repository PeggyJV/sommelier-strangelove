import {
  SkeletonProps,
  Skeleton as ChakraSkeleton,
} from "@chakra-ui/react"

export const TransparentSkeleton = (props: SkeletonProps) => (
  <ChakraSkeleton
    startColor="surface.primary"
    endColor="surface.secondary"
    {...props}
  />
)

export const LighterSkeleton = (props: SkeletonProps) => (
  <ChakraSkeleton
    startColor="#413083"
    endColor="purple.dark"
    {...props}
  />
)

export const LightSkeleton = ({
  height = "160px",
}: {
  height?: string | number
}) => (
  <div
    role="status"
    aria-label="Loading"
    style={{
      border: "1px solid var(--chakra-colors-surface-secondary)",
      borderRadius: 12,
      background: "var(--chakra-colors-surface-primary)",
      width: "100%",
      minHeight: typeof height === "number" ? `${height}px` : height,
    }}
  />
)
