import { useState, useEffect, useRef } from "react"

const FORWARD = "forward"
const BACKWARD = "backward"

export const useTypingText = (
  words: string[],
  keySpeed = 80,
  maxPauseAmount = 10
) => {
  const [wordIndex, setWordIndex] = useState(0)
  const [currentWord, setCurrentWord] = useState(
    words[wordIndex].split("")
  )
  const direction = useRef(BACKWARD)
  const typingInterval = useRef<number>()
  const letterIndex = useRef<number>()

  useEffect(() => {
    let pauseCounter = 0

    const typeLetter = () => {
      if (
        letterIndex.current &&
        letterIndex.current >= words[wordIndex].length
      ) {
        direction.current = BACKWARD
        pauseCounter = maxPauseAmount
        return
      }

      const segment = words[wordIndex].split("")
      setCurrentWord(
        currentWord.concat(segment[letterIndex.current as number])
      )
      letterIndex.current = (letterIndex.current as number) + 1
    }

    const backspace = () => {
      if (letterIndex.current === 0) {
        const isOnLastWord = wordIndex === words.length - 1

        setWordIndex(!isOnLastWord ? wordIndex + 1 : 0)
        direction.current = FORWARD

        return
      }

      const segment = currentWord.slice(0, currentWord.length - 1)
      setCurrentWord(segment)
      letterIndex.current = currentWord.length - 1
    }

    typingInterval.current = window.setInterval(() => {
      if (pauseCounter > 0) {
        pauseCounter = pauseCounter - 1
        return
      }
      if (direction.current === FORWARD) {
        typeLetter()
      } else {
        backspace()
      }
    }, keySpeed)

    return () => {
      clearInterval(typingInterval.current)
    }
  }, [currentWord, wordIndex, keySpeed, words, maxPauseAmount])

  return {
    word: (
      <span
        className={`word ${currentWord.length ? "full" : "empty"}`}
      >
        <span>{currentWord.length ? currentWord.join("") : ""}</span>
        {currentWord.join("") === words[wordIndex] ? (
          <span className="blink_me blinker">|</span>
        ) : (
          <span className="blinker">|</span>
        )}
      </span>
    ),
  }
}
