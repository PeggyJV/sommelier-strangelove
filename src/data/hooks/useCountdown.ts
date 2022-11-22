interface useCountdownProps {
  launchDate: string | null
}
export const useCountdown = ({ launchDate }: useCountdownProps) => {
  const formatedLaunchDate = launchDate ? new Date(launchDate) : null
  const formatedDateNow = new Date(Date.now())

  const isCountdown =
    formatedLaunchDate !== null
      ? formatedLaunchDate > formatedDateNow
      : false

  return isCountdown
}
