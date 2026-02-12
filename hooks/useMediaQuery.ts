'use client'
import { useEffect, useState, useCallback, useMemo } from 'react'

export const useWindowWidth = () => {
  const [windowWidth, setWindowWidth] = useState(0)
  const [isClient, setIsClient] = useState(false)

  const handleResize = useCallback(() => {
    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth)
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsClient(true)
    handleResize()

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [handleResize])

  return { windowWidth, isClient }
}

export const useMediaQuery = (maxWidth: number) => {
  const { windowWidth, isClient } = useWindowWidth()

  const isMedia = useMemo(() => {
    if (!isClient) return false
    return windowWidth <= maxWidth
  }, [windowWidth, maxWidth, isClient])

  return isMedia
}
