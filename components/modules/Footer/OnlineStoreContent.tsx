import Link from 'next/link'
import styles from '@/styles/footer.module.scss'

const OnlineStoreContent = () => (
  <ul className={styles.footer__top__item__list}>
    <li className={styles.footer__top__item__list__item}>
      <Link
        href="/catalog"
        className={styles.footer__top__item__list__item__link}
      >
        Каталог
      </Link>
    </li>
    <li className={styles.footer__top__item__list__item}>
      <Link
        href="/shipping-payment"
        className={styles.footer__top__item__list__item__link}
      >
        Доставка и оплата
      </Link>
    </li>
  </ul>
)

export default OnlineStoreContent
