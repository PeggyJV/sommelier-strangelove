export const getChanges = (
  dayDatas?: { date: number; shareValue: string }[]
) => {
  const cleanData = dayDatas?.map((d) => ({
    ...d,
    shareValue:
      d.shareValue === "0" ? undefined : Number(d.shareValue),
  }))

  const daily = (() => {
    const first = cleanData?.[0]
    const last = cleanData?.[1]
    if (!first || !last) return
    const change =
      ((Number(first?.shareValue) - Number(last?.shareValue)) /
        Number(last?.shareValue)) *
      100
    return change
  })()

  const weekly = (() => {
    const first = cleanData?.[0]
    const last = cleanData?.[6]
    if (!first || !last) return
    const change =
      ((Number(first?.shareValue) - Number(last?.shareValue)) /
        Number(last?.shareValue)) *
      100
    return change
  })()

  const monthly = (() => {
    const first = cleanData?.[0]
    const last = cleanData?.[cleanData.length - 1]

    if (!first || !last) return

    // If last date is LT 30 days ago, return
    if ((last?.date ?? 0) < (Date.now() / 1000) - (60 * 60 * 24 * 30))
      return 

    const change =
      ((Number(first?.shareValue) - Number(last?.shareValue)) /
        Number(last?.shareValue)) *
      100
    return change
  })()

  const allTime = (() => {
    const first = cleanData?.[0]
    const last = cleanData?.at(-1)
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
