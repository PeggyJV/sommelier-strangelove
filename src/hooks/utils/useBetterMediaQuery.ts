import { useEffect, useState } from "react"

/**
 * @see https://github.com/chakra-ui/chakra-ui/issues/3580#issuecomment-1131211586
 */
export default function useBetterMediaQuery(
  mediaQueryString: string
) {
  const [matches, setMatches] = useState<boolean | null>(null)

  useEffect(() => {
    const mediaQueryList = window.matchMedia(mediaQueryString)
    const listener = () => setMatches(!!mediaQueryList.matches)
    listener()
    mediaQueryList.addEventListener("change", listener)
    return () =>
      mediaQueryList.removeEventListener("change", listener)
  }, [mediaQueryString])

  return matches
}
