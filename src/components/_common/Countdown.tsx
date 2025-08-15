import {
  Box,
  HStack,
  Stack,
  Text,
  VisuallyHidden,
} from "@chakra-ui/react"
import { useEffect, useMemo, useRef, useState } from "react"

type CountdownSize = "sm" | "md" | "lg"

export interface CountdownProps {
  targetDate: Date
  onExpire?: () => void
  size?: CountdownSize
}

type TimeParts = {
  totalMs: number
  days: number
  hours: number
  minutes: number
  seconds: number
}

function getRemainingParts(target: Date, now: Date): TimeParts {
  const totalMs = Math.max(0, target.getTime() - now.getTime())
  const totalSeconds = Math.floor(totalMs / 1000)
  const days = Math.floor(totalSeconds / (24 * 3600))
  const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = Math.floor(totalSeconds % 60)
  return { totalMs, days, hours, minutes, seconds }
}

const sizeStyles: Record<
  CountdownSize,
  {
    number: string
    label: string
    gap: number
    px: number
    py: number
  }
> = {
  sm: { number: "lg", label: "xs", gap: 3, px: 2, py: 1 }, // ~12px gap
  md: { number: "2xl", label: "sm", gap: 4, px: 3, py: 2 }, // ~16px gap
  lg: { number: "3xl", label: "md", gap: 5, px: 4, py: 3 }, // ~20px gap
}

export default function Countdown({
  targetDate,
  onExpire,
  size = "md",
}: CountdownProps) {
  // Prevent hydration mismatch: render zeros until mounted
  const [mounted, setMounted] = useState(false)
  const [now, setNow] = useState<Date>(new Date(targetDate))
  const expiredRef = useRef(false)
  const intervalRef = useRef<number | null>(null)

  const parts = useMemo(() => {
    if (!mounted) {
      return { totalMs: 0, days: 0, hours: 0, minutes: 0, seconds: 0 }
    }
    return getRemainingParts(targetDate, now)
  }, [mounted, targetDate, now])

  useEffect(() => {
    setMounted(true)

    const tick = () => setNow(new Date())

    // first paint after mount
    tick()
    intervalRef.current = window.setInterval(tick, 1000)

    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current)
    }
  }, [targetDate])

  useEffect(() => {
    if (mounted && !expiredRef.current && parts.totalMs === 0) {
      expiredRef.current = true
      onExpire?.()
    }
  }, [mounted, parts.totalMs, onExpire])

  const s = sizeStyles[size]

  const unitBox = (
    value: number,
    label: string,
    ariaLabel: string
  ) => (
    <Box
      textAlign="center"
      px={s.px}
      py={s.py}
      minW={{ base: 18, md: 20 }}
      bg="whiteAlpha.100"
      rounded="lg"
      backdropFilter="auto"
      backdropBlur="2px"
    >
      <VisuallyHidden>{ariaLabel}</VisuallyHidden>
      <Text fontWeight={700} fontSize={s.number} lineHeight={1} color="white">
        {value.toString().padStart(2, "0")}
      </Text>
      <Text fontSize={s.label} color="gray.300">
        {label}
      </Text>
    </Box>
  )

  return (
    <Stack direction={{ base: "row" }} spacing={s.gap} align="center" justify="center">
      <HStack spacing={s.gap} align="stretch">
        {unitBox(parts.days, "Days", `Days: ${parts.days}`)}
        {unitBox(parts.hours, "Hours", `Hours: ${parts.hours}`)}
        {unitBox(parts.minutes, "Minutes", `Minutes: ${parts.minutes}`)}
        {unitBox(parts.seconds, "Seconds", `Seconds: ${parts.seconds}`)}
      </HStack>
    </Stack>
  )
}
