import { useCallback, useEffect, useRef } from 'react'

export const useDebounceCallback = (delay = 100) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const debouncedCallback = useCallback(
    (callback: () => void) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        callback()
      }, delay)
    },
    [delay]
  )

  return debouncedCallback
}
