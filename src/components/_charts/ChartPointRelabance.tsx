interface PointProps {
  fill: string
  stroke: string
}

export const ChartPointRebalance = (props: PointProps) => {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 26 26"
      fill="none"
      x="-10"
      y="-10"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="13"
        cy="13"
        r="12"
        fill="black"
        stroke="#FAFAFC"
        strokeWidth="2"
      />
      <circle
        cx="13"
        cy="13"
        r="8"
        fill="white"
        stroke="white"
        strokeWidth="2"
      />
      <path
        d="M8.35718 11.5714L10.1429 9.78571L11.9286 11.5714"
        stroke="#121214"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.2857 17.6428H10.8571C10.6677 17.6428 10.486 17.5676 10.352 17.4336C10.2181 17.2997 10.1428 17.118 10.1428 16.9286V9.78571"
        stroke="#121214"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.643 14.4285L15.8572 16.2142L14.0715 14.4285"
        stroke="#121214"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.7144 8.35712H15.1429C15.3324 8.35712 15.514 8.43237 15.648 8.56633C15.782 8.70028 15.8572 8.88196 15.8572 9.0714V16.2143"
        stroke="#121214"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
