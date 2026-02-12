import { ILayoutProps } from '@/lib/types/common'
import Header from '../modules/Header/Header'
import Footer from '../modules/Footer/Footer'

const Layout = ({ children }: ILayoutProps) => (
  <>
    <Header />
    {children}
    <Footer />
  </>
)

export default Layout
