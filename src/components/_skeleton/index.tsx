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
