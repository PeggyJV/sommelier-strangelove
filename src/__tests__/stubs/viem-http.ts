export const http = () => {
  return () => {
    throw new Error("Network error")
  }
}
