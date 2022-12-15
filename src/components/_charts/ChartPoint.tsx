interface PointProps {
  fill: string
  stroke: string
}

export const ChartPoint = (props: PointProps) => {
  return (
    <svg height="16" width="16" x="-7.5" y="-7.5">
      <circle
        cx="7"
        cy="7"
        r="6"
        fill={props.fill}
        strokeWidth="2"
        stroke={props.stroke}
      />
    </svg>
  )
}
