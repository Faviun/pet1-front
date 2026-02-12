import HeaderBottom from './HeaderBottom'
import HeaderTop from './HeaderTop'
import styles from '@/styles/header.module.scss'

const Header = () => (
  <header className={styles.header}>
    <HeaderTop />
    <HeaderBottom />
  </header>
)

export default Header
