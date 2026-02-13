'use client'
import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Head from 'next/head'
import { toast } from 'react-toastify'
import { useUnit } from 'effector-react'
import Layout from '@/components/layout/Layout'
import PartPage from '@/components/templates/PartPage/PartPage'
import Breadcrumbs from '@/components/modules/Breadcrumbs/Breadcrumbs'
import useRedirectByUserCheck from '@/hooks/useRedirectByUserCheck'
import { $boilerPart, setBoilerPart } from '@/context/boilerPart'
import { getBoilerPartFx } from '@/lib/api/boilerParts'

const PAGE_TITLE_PREFIX = 'Аква Тепмикс |'
const CRUMB_SELECTOR = '.last-crumb'

function CatalogPartPage() {
  const router = useRouter()
  const params = useParams()
  const { shouldLoadContent } = useRedirectByUserCheck()
  const boilerPart = useUnit($boilerPart)

  const [error, setError] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isClient, setIsClient] = useState<boolean>(false)

  const partId = params?.partId as string | undefined

  useEffect(() => {
    setIsClient(true)
  }, [])

  const loadBoilerPart = useCallback(async (id: string) => {
    try {
      setIsLoading(true)
      setError(false)

      const data = await getBoilerPartFx(`/boiler-parts/find/${id}`)

      if (!data) {
        setError(true)
        return
      }

      setBoilerPart(data)
    } catch (error) {
      setError(true)
      toast.error(
        error instanceof Error ? error.message : 'Ошибка при загрузке товара'
      )
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (partId) {
      loadBoilerPart(partId)
    }
  }, [partId, loadBoilerPart])

  useEffect(() => {
    return () => {
      setBoilerPart({} as any)
    }
  }, [])

  useEffect(() => {
    const updateBreadcrumb = () => {
      if (!boilerPart?.name) return

      const lastCrumb = document.querySelector<HTMLElement>(CRUMB_SELECTOR)
      if (lastCrumb) {
        lastCrumb.textContent = boilerPart.name
      }
    }

    const timeoutId = setTimeout(updateBreadcrumb, 0)
    return () => clearTimeout(timeoutId)
  }, [boilerPart?.name])

  const getPageTitle = useCallback(() => {
    if (error) return `${PAGE_TITLE_PREFIX} Товар не найден`
    if (!isClient || isLoading) return `${PAGE_TITLE_PREFIX} Загрузка...`
    if (shouldLoadContent && boilerPart?.name)
      return `${PAGE_TITLE_PREFIX} ${boilerPart.name}`
    return `${PAGE_TITLE_PREFIX} Каталог`
  }, [error, isClient, isLoading, shouldLoadContent, boilerPart?.name])

  if (!isClient) {
    return (
      <>
        <Head>
          <title>{PAGE_TITLE_PREFIX} Загрузка...</title>
          <meta charSet="UTF-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <link rel="icon" type="image/svg" href="/img/logo.svg" />
        </Head>
        <Layout>
          <main>
            <div className="loading-container">
              <div className="loader">Загрузка...</div>
            </div>
          </main>
        </Layout>
      </>
    )
  }

  if (error) {
    return (
      <>
        <Head>
          <title>{getPageTitle()}</title>
          <meta charSet="UTF-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <link rel="icon" type="image/svg" href="/img/logo.svg" />
        </Head>
        <Layout>
          <main>
            <div className="error-container">
              <h1>Товар не найден</h1>
              <p>Запрошенный товар не существует или был удален</p>
              <button onClick={() => router.back()} className="error-button">
                Вернуться назад
              </button>
            </div>
          </main>
        </Layout>
      </>
    )
  }

  if (isLoading || !shouldLoadContent) {
    return (
      <>
        <Head>
          <title>{getPageTitle()}</title>
          <meta charSet="UTF-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <link rel="icon" type="image/svg" href="/img/logo.svg" />
        </Head>
        <Layout>
          <main>
            <div className="loading-container">
              <div className="loader">Загрузка товара...</div>
            </div>
          </main>
        </Layout>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>{getPageTitle()}</title>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="description"
          content={
            boilerPart?.description ||
            `Страница товара ${boilerPart?.name || ''}`
          }
        />
        <link rel="icon" type="image/svg" href="/img/logo.svg" />
      </Head>

      <Layout>
        <main>
          <Breadcrumbs currentPage="Каталог" />
          <PartPage />
          <div className="overlay" />
        </main>
      </Layout>
    </>
  )
}

export default CatalogPartPage
