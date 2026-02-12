'use client'
import { useUnit } from 'effector-react'
import Link from 'next/link'
import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { $mode } from '@/context/mode'
import SearchInput from '@/components/elements/Header/SearchInput'
import ModeToggler from '@/components/elements/ModeToggler/ModeToggler'
import CartPopup from './CartPopup/CartPopup'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { setDisableCart } from '@/context/shopping-cart'
import styles from '@/styles/header.module.scss'

const HeaderBottom = () => {
  const isMedia950 = useMediaQuery(950)
  const mode = useUnit($mode)
  const darkModeClass = mode === 'dark' ? `${styles.dark_mode}` : ''
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (pathname === '/order') {
      setDisableCart(true)
      return
    }

    setDisableCart(false)
  }, [pathname])

  return (
    <div className={styles.header__bottom}>
      <div className={`container ${styles.header__bottom__container}`}>
        <h1 className={styles.header__logo}>
          <Link href="/dashboard" className={styles.header__logo__link}>
            <img src="/img/logo.svg" alt="logo" />
            <span
              className={`${styles.header__logo__link__text} ${darkModeClass}`}
            >
              Детали для газовых котлов
            </span>
          </Link>
        </h1>
        <div className={styles.header__search}>
          <SearchInput />
        </div>
        <div className={styles.header__shopping_cart}>
          {!isMedia950 && <ModeToggler />}
          <CartPopup />
        </div>
      </div>
    </div>
  )
}

export default HeaderBottom
