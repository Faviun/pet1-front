import Head from 'next/head'
import Layout from '@/components/layout/Layout'
import ShippingPayment from '@/components/templates/ShippingPayment/ShippingPayment'
import Breadcrumbs from '@/components/modules/Breadcrumbs/Breadcrumbs'

function ShippingPaymentPage() {
  return (
    <>
      <Head>
        <title>Аква Тепмикс | Доставка и оплата</title>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" type="image/svg" sizes="32x32" href="/img/logo.svg" />
      </Head>
      <Layout>
        <main>
          <Breadcrumbs currentPage="Доставка и оплата" />
          <ShippingPayment />
          <div className="overlay" />
        </main>
      </Layout>
    </>
  )
}

export default ShippingPaymentPage
