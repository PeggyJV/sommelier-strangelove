import { JSX } from "react"

export const EthIcon = (props: any) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <path d="M12 2l7 10-7 4-7-4 7-10z" fill="#627EEA" />
    <path d="M12 22l7-12-7 4-7-4 7 12z" fill="#627EEA" opacity=".6" />
  </svg>
)

export const ArbIcon = (props: any) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <rect x="3" y="3" width="18" height="18" rx="4" fill="#2D3748" />
    <path d="M8 16l3-8h2l3 8h-2l-2-5-2 5H8z" fill="#28A0F0" />
  </svg>
)

export const OpIcon = (props: any) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <circle cx="12" cy="12" r="9" fill="#FF0420" />
    <path
      d="M8 13h4.5l.5-2H8.5L8 13zM12 13h4l.5-2H12.5L12 13z"
      fill="#fff"
    />
  </svg>
)

export const ChainFallbackIcon = (props: any) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <circle cx="12" cy="12" r="9" fill="#718096" />
  </svg>
)

export const CHAIN_ICON: Record<number, JSX.Element> = {
  1: <EthIcon />,
  42161: <ArbIcon />,
  10: <OpIcon />,
}
