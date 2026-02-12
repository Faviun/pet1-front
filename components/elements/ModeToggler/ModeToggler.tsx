'use client'
import { useUnit } from 'effector-react'
import { useEffect } from 'react'
import { $mode } from '@/context/mode'
import styles from '@/styles/modeToggler.module.scss'
import { useTheme } from '@/hooks/useTheme'

const ModeToggler = () => {
  const { toggleTheme } = useTheme()
  const mode = useUnit($mode)

  const handleToggleMode = () => {
    toggleTheme()
    document.body.classList.toggle('dark_mode')
  }

  useEffect(() => {
    document.body.classList.add(mode === 'dark' ? 'dark_mode' : 'body')
  }, [mode])

  return (
    <div className={styles.theme}>
      <input
        className={styles.theme__input}
        type="checkbox"
        checked={mode === 'light'}
        onChange={handleToggleMode}
      />
    </div>
  )
}

export default ModeToggler
