export const getChanges = (
  dayDatas?: { date: number; shareValue: string }[]
) => {
  const daily = (() => {
    const first = dayDatas?.[0]
    const last = dayDatas?.[1]
    if (!first || !last) return
    const change =
      ((Number(first?.shareValue) - Number(last?.shareValue)) /
        Number(last?.shareValue)) *
      100
    return change
  })()

  const weekly = (() => {
    const first = dayDatas?.[0]
    const last = dayDatas?.[6]
    if (!first || !last) return
    const change =
      ((Number(first?.shareValue) - Number(last?.shareValue)) /
        Number(last?.shareValue)) *
      100
    return change
  })()

  const monthly = (() => {
    const first = dayDatas?.[0]
    const last = dayDatas?.[30]
    if (!first || !last) return
    const change =
      ((Number(first?.shareValue) - Number(last?.shareValue)) /
        Number(last?.shareValue)) *
      100
    return change
  })()

  const allTime = (() => {
    const first = dayDatas?.[0]
    const last = dayDatas?.at(-1)
    if (!first || !last) return
    const change =
      ((Number(first?.shareValue) - Number(last?.shareValue)) /
        Number(last?.shareValue)) *
      100
    return change
  })()

  return {
    daily,
    weekly,
    monthly,
    allTime,
  }
}
