import {
  SkeletonProps,
  Skeleton as ChakraSkeleton,
} from "@chakra-ui/react"

export const TransparentSkeleton = (props: SkeletonProps) => (
  <ChakraSkeleton
    startColor="brand.surface"
    endColor="border.subtle"
    {...props}
  />
)

export const LighterSkeleton = (props: SkeletonProps) => (
  <ChakraSkeleton
    startColor="brand.surface"
    endColor="brand.secondary"
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
      border: "1px solid #292D36",
      borderRadius: 16,
      background: "#1A1D25",
      width: "100%",
      minHeight: typeof height === "number" ? `${height}px` : height,
    }}
  />
)
