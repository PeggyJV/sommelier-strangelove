interface PointProps {
  fill: string
  stroke: string
}

export const ChartPointRebalance = (props: PointProps) => {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      x="-10"
      y="-10"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="9"
        cy="9"
        r="8"
        fill="white"
        stroke="white"
        strokeWidth="2"
      />
      <path
        d="M4.35693 7.57142L6.14265 5.78571L7.92836 7.57142"
        stroke="#121214"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.28544 13.6428H6.85686C6.66742 13.6428 6.48574 13.5676 6.35179 13.4336C6.21783 13.2997 6.14258 13.118 6.14258 12.9286V5.78571"
        stroke="#121214"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.6427 10.4286L11.857 12.2143L10.0713 10.4286"
        stroke="#121214"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.71387 4.35715H11.1424C11.3319 4.35715 11.5136 4.4324 11.6475 4.56636C11.7815 4.70031 11.8567 4.88199 11.8567 5.07143V12.2143"
        stroke="#121214"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
