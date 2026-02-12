import Link from 'next/link'
import { useUnit } from 'effector-react'
import { formatPrice } from '@/lib/utils/common'
import { $mode } from '@/context/mode'
import { $totalPrice } from '@/context/shopping-cart'
import styles from '@/styles/dashboard.module.scss'
import { ICartAlertProps } from '@/lib/types/dashboard'

const CartAlert = ({ count, closeAlert }: ICartAlertProps) => {
  const mode = useUnit($mode)
  const totalPrice = useUnit($totalPrice)
  const darkModeClass = mode === 'dark' ? `${styles.dark_mode}` : ''

  const showCountMessage = (count: string) => {
    if (count.endsWith('1')) {
      return 'товар'
    }

    if (count.endsWith('2') || count.endsWith('3') || count.endsWith('4')) {
      return 'товара'
    }

    return 'товаров'
  }

  return (
    <>
      <div className={`${styles.dashboard__alert__left} ${darkModeClass}`}>
        <span>
          В корзине {count} {showCountMessage(`${count}`)}
        </span>
        <span>На сумму {formatPrice(totalPrice)} P</span>
      </div>
      <div className={styles.dashboard__alert__right}>
        <Link href="/order" className={styles.dashboard__alert__btn_cart}>
          Перейти в корзину
        </Link>
        <Link href="/order" className={styles.dashboard__alert__btn_order}>
          Оформить заказ
        </Link>
      </div>
      <button
        className={styles.dashboard__alert__btn_close}
        onClick={closeAlert}
      />
    </>
  )
}

export default CartAlert
