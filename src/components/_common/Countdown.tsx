import {
  Box,
  Stack,
  Text,
  VisuallyHidden,
  HStack,
} from "@chakra-ui/react"
import { useEffect, useMemo, useRef, useState } from "react"

type CountdownSize = "sm" | "md" | "lg"

export interface CountdownProps {
  targetDate: Date
  onExpire?: () => void
  size?: CountdownSize
  variant?: "boxed" | "plain"
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
  variant: _variant = "plain",
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
      if (intervalRef.current)
        window.clearInterval(intervalRef.current)
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
      as="span"
      display="inline-flex"
      flexDir="column"
      alignItems="center"
      whiteSpace="nowrap"
      minW="fit-content"
      sx={{ fontVariantNumeric: "tabular-nums" }}
    >
      <VisuallyHidden>{ariaLabel}</VisuallyHidden>
      <Stack spacing={1} align="center" justify="center">
        <Text
          fontWeight={700}
          fontSize={s.number}
          lineHeight={1}
          color="count.box.fg"
          sx={{ fontVariantNumeric: "tabular-nums" }}
        >
          {value.toString().padStart(2, "0")}
        </Text>
        <Text fontSize={s.label} color="count.box.sub">
          {label}
        </Text>
      </Stack>
    </Box>
  )

  return (
    <Box 
      role="timer" 
      aria-live="polite" 
      aria-atomic="true" 
      w="full"
      overflow="hidden"
    >
      <HStack
        spacing={s.gap}
        justify="space-between"
        align="center"
        w="full"
        minW="320px"
        maxW="100%"
      >
        {unitBox(parts.days, "Days", `Days: ${parts.days}`)}
        {unitBox(parts.hours, "Hours", `Hours: ${parts.hours}`)}
        {unitBox(
          parts.minutes,
          "Minutes",
          `Minutes: ${parts.minutes}`
        )}
        {unitBox(
          parts.seconds,
          "Seconds",
          `Seconds: ${parts.seconds}`
        )}
      </HStack>
    </Box>
  )
}
