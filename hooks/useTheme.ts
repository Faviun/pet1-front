'use client'

import { useEffect, useState, useCallback } from 'react'
import { useStore } from 'effector-react'
import { setMode, $mode } from '../context/mode'

export const useTheme = () => {
  const mode = useStore($mode)
  const [isMounted, setIsMounted] = useState(false)

  const toggleTheme = useCallback(() => {
    if (!isMounted) return

    const newMode = mode === 'dark' ? 'light' : 'dark'
    setMode(newMode)

    try {
      localStorage.setItem('mode', newMode)

      // Обновляем атрибут data-theme для CSS переменных
      document.documentElement.setAttribute('data-theme', newMode)
      document.documentElement.classList.toggle('dark', newMode === 'dark')
    } catch (error) {
      console.error('Error saving theme to localStorage:', error)
    }
  }, [mode, isMounted])

  // Инициализация темы
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true)

    const loadTheme = () => {
      try {
        const savedTheme = localStorage.getItem('mode')

        if (savedTheme) {
          const theme = savedTheme.replace(/"/g, '')
          const validTheme = theme === 'dark' ? 'dark' : 'light'
          setMode(validTheme)

          // Устанавливаем атрибуты
          document.documentElement.setAttribute('data-theme', validTheme)
          document.documentElement.classList.toggle(
            'dark',
            validTheme === 'dark'
          )
        } else {
          // Проверяем системную тему
          const prefersDark = window.matchMedia(
            '(prefers-color-scheme: dark)'
          ).matches
          const systemTheme = prefersDark ? 'dark' : 'light'
          setMode(systemTheme)
          document.documentElement.setAttribute('data-theme', systemTheme)
          document.documentElement.classList.toggle(
            'dark',
            systemTheme === 'dark'
          )
        }
      } catch (error) {
        console.error('Error loading theme:', error)
        // Fallback на светлую тему
        setMode('light')
        document.documentElement.setAttribute('data-theme', 'light')
      }
    }

    loadTheme()
  }, [])

  // Следим за изменениями системной темы
  useEffect(() => {
    if (!isMounted) return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleChange = (e: MediaQueryListEvent) => {
      try {
        // Проверяем, выбрал ли пользователь тему вручную
        const userTheme = localStorage.getItem('mode')
        if (userTheme) return

        const newTheme = e.matches ? 'dark' : 'light'
        setMode(newTheme)
        document.documentElement.setAttribute('data-theme', newTheme)
        document.documentElement.classList.toggle('dark', newTheme === 'dark')
      } catch (error) {
        console.error('Error handling theme change:', error)
      }
    }

    // Добавляем поддержку старых браузеров
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange)
    } else {
      // Для старых браузеров
      mediaQuery.addListener(handleChange)
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange)
      } else {
        mediaQuery.removeListener(handleChange)
      }
    }
  }, [isMounted])

  // SSR-safe значения
  const safeMode = !isMounted ? 'light' : mode

  return {
    toggleTheme,
    mode: safeMode,
    isMounted,
    isDark: safeMode === 'dark',
    isLight: safeMode === 'light',
  }
}
