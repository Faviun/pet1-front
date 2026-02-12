import { useEffect, useState } from 'react'
import { useUnit } from 'effector-react'
import Link from 'next/link'
import CrumbArrowSvg from '@/components/elements/CrumbArrowSvg/CrumbArrowSvg'
import { ICrumbProps } from '@/lib/types/common'
import { $mode } from '@/context/mode'
import styles from '@/styles/breadcrumbs.module.scss'

const Crumb = ({
  text: defaultText,
  textGenerator,
  href,
  last = false,
}: ICrumbProps) => {
  const [text, setText] = useState(defaultText)
  const mode = useUnit($mode)
  const darkModeClass = mode === 'dark' ? `${styles.dark_mode}` : ''

  useEffect(() => {
    handleTextGenerate()
  }, [textGenerator])

  const handleTextGenerate = async () => {
    if (!textGenerator) {
      return
    }

    try {
      const finalText = await textGenerator()
      setText(finalText)
    } catch (error) {
      console.error('Error generating crumb text:', error)
    }
  }

  if (last) {
    return (
      <span className={styles.breadcrumbs__crumb}>
        <span
          className={`${styles.breadcrumbs__item__icon} ${darkModeClass}`}
          style={{ marginRight: 13 }}
        >
          <CrumbArrowSvg />
        </span>
        <span
          className={`last-crumb ${styles.breadcrumbs__item__text} ${darkModeClass}`}
        >
          {text}
        </span>
      </span>
    )
  }

  return (
    <Link href={href} className={styles.breadcrumbs__link}>
      <span
        className={`${styles.breadcrumbs__item__icon} ${darkModeClass}`}
        style={{ marginRight: 13 }}
      >
        <CrumbArrowSvg />
      </span>
      <span className={`${styles.breadcrumbs__item__text} ${darkModeClass}`}>
        {text}
      </span>
    </Link>
  )
}

export default Crumb
