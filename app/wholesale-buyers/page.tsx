import Head from 'next/head'
import ContactsPage from '@/components/templates/ContactsPage/ContactsPage'
import Layout from '@/components/layout/Layout'
import Breadcrumbs from '@/components/modules/Breadcrumbs/Breadcrumbs'

function WholesaleBuyers() {
  return (
    <>
      <Head>
        <title>Аква Термикс | Оптовым покупателям</title>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" type="image/svg" sizes="32x32" href="/img/logo.svg" />
      </Head>
      <Layout>
        <main>
          <Breadcrumbs currentPage="Оптовым покупателям" />
          <ContactsPage isWholesaleBuyersPage={true} />
        </main>
        <div className="overlay" />
      </Layout>
    </>
  )
}

export default WholesaleBuyers
