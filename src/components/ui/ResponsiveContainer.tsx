import { ReactNode } from "react"

export default function ResponsiveContainer({
  children,
  className = "",
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={
        `w-full mx-auto ` +
        `px-[max(env(safe-area-inset-left),16px)] ` +
        `pr-[max(env(safe-area-inset-right),16px)] ` +
        `sm:px-6 lg:px-8 ` +
        className
      }
    >
      {children}
    </div>
  )
}
