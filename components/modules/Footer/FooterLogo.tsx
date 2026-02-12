import Link from 'next/link'
import styles from '@/styles/footer.module.scss'

const FooterLogo = () => (
  <div className={styles.footer__top__item}>
    <Link href="/dashboard" className={styles.footer__top__item__logo}>
      <img src="/img/logo-footer.svg" alt="logo" />
      <span className={styles.footer__top__item__logo__text}>
        Детали для газовых котлов
      </span>
    </Link>
  </div>
)

export default FooterLogo
