export const isValidURL = (value: string) => {
  const res = value.match(
    /^(http(s)?:\/\/)[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm
  )
  return res !== null
}
