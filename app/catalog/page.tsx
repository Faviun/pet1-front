'use client'

import Head from 'next/head'
import Layout from '@/components/layout/Layout'
import Breadcrumbs from '@/components/modules/Breadcrumbs/Breadcrumbs'
import { IQueryParams } from '@/lib/types/catalog'
import useRedirectByUserCheck from '@/hooks/useRedirectByUserCheck'
import CatalogPage from '@/components/templates/CatalogPage/CatalogPage'

function Catalog({ query }: { query: IQueryParams }) {
  const { shouldLoadContent } = useRedirectByUserCheck()

  return (
    <>
      <Head>
        <title>Аква Тепмикс | {shouldLoadContent ? 'Каталог' : ''}</title>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" type="image/svg" sizes="32x32" href="/img/logo.svg" />
      </Head>
      <Layout>
        <main>
          <Breadcrumbs currentPage="Каталог" />
          <CatalogPage query={query} />
          <div className="overlay" />
        </main>
      </Layout>
    </>
  )
}

export default Catalog
