import Link from 'next/link'
import styles from '@/styles/footer.module.scss'

const CompanyContent = () => (
  <ul className={styles.footer__top__item__list}>
    <li className={styles.footer__top__item__list__item}>
      <Link
        href="/about"
        className={styles.footer__top__item__list__item__link}
      >
        О компании
      </Link>
    </li>
    <li className={styles.footer__top__item__list__item}>
      <Link
        href="/contacts"
        className={styles.footer__top__item__list__item__link}
      >
        Обратная связь
      </Link>
    </li>
    <li className={styles.footer__top__item__list__item}>
      <Link
        href="/wholesale-buyers"
        className={styles.footer__top__item__list__item__link}
      >
        Оптовым покупателям
      </Link>
    </li>
    <li className={styles.footer__top__item__list__item}>
      <Link
        href="/contacts"
        className={styles.footer__top__item__list__item__link}
      >
        Контакты
      </Link>
    </li>
  </ul>
)

export default CompanyContent
