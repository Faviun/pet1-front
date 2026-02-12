'use client'
import { useUnit } from 'effector-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { usePathname, useSearchParams } from 'next/navigation'
import { useMemo } from 'react'
import { $mode } from '@/context/mode'
import Crumb from './Crumb'
import styles from '@/styles/breadcrumbs.module.scss'

interface BreadcrumbItem {
  text: string
  href: string
}

interface BreadcrumbsProps {
  getTextGenerator?: (param: string, query: URLSearchParams) => string
  getDefaultTextGenerator?: (subpath: string, href: string) => string

  items?: BreadcrumbItem[]
  currentPage?: string
}

const generatePathParts = (pathStr: string) => {
  const pathWithoutQuery = pathStr.split('?')[0]
  return pathWithoutQuery.split('/').filter((v) => v.length > 0)
}

const Breadcrumbs = ({
  getTextGenerator,
  getDefaultTextGenerator,
  items,
  currentPage,
}: BreadcrumbsProps) => {
  const mode = useUnit($mode)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const darkModeClass = mode === 'dark' ? `${styles.dark_mode}` : ''

  const breadcrumbsFromItems = useMemo(() => {
    if (items && items.length > 0) {
      return items.map((item, idx) => ({
        href: item.href,
        text: item.text,
        last: idx === items.length - 1,
      }))
    }
    return []
  }, [items])

  const breadcrumbsFromCurrentPage = useMemo(() => {
    if (currentPage) {
      return [
        { href: '/dashboard', text: 'Главная', last: false },
        { href: pathname, text: currentPage, last: true },
      ]
    }
    return []
  }, [currentPage, pathname])

  const generatedBreadcrumbs = useMemo(() => {
    if (getTextGenerator && getDefaultTextGenerator) {
      const asPathNestedRoutes = generatePathParts(pathname)
      const pathnameNestedRoutes = generatePathParts(pathname)

      const crumbList = asPathNestedRoutes.map((subpath, idx) => {
        const param =
          pathnameNestedRoutes[idx]?.replace('[', '')?.replace(']', '') || ''

        const href = '/' + asPathNestedRoutes.slice(0, idx + 1).join('/')
        return {
          href,
          text: getTextGenerator
            ? getTextGenerator(param, searchParams)
            : getDefaultTextGenerator(subpath, href),
          last: idx === asPathNestedRoutes.length - 1,
        }
      })

      return crumbList
    }
    return []
  }, [pathname, searchParams, getTextGenerator, getDefaultTextGenerator])

  const breadcrumbs = useMemo(() => {
    if (breadcrumbsFromItems.length > 0) {
      return breadcrumbsFromItems
    }
    if (breadcrumbsFromCurrentPage.length > 0) {
      return breadcrumbsFromCurrentPage
    }
    return generatedBreadcrumbs
  }, [breadcrumbsFromItems, breadcrumbsFromCurrentPage, generatedBreadcrumbs])

  return (
    <div className="container">
      <ul className={styles.breadcrumbs}>
        <li className={styles.breadcrumbs__item}>
          <Link href="/dashboard" className={styles.breadcrumbs__link}>
            <span
              className={`${styles.breadcrumbs__item__icon} ${darkModeClass}`}
              style={{ marginRight: 0 }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12.6667 13.9993H3.33341C3.1566 13.9993 2.98703 13.9291 2.86201 13.804C2.73699 13.679 2.66675 13.5094 2.66675 13.3326V7.33263H0.666748L7.55141 1.07396C7.67415 0.962281 7.83414 0.900391 8.00008 0.900391C8.16603 0.900391 8.32601 0.962281 8.44875 1.07396L15.3334 7.33263H13.3334V13.3326C13.3334 13.5094 13.2632 13.679 13.1382 13.804C13.0131 13.9291 12.8436 13.9993 12.6667 13.9993ZM4.00008 12.666H12.0001V6.10396L8.00008 2.46796L4.00008 6.10396V12.666Z" />
              </svg>
            </span>
          </Link>
        </li>

        {breadcrumbs
          .filter((crumb) => crumb.text && crumb.text.trim() !== '')
          .map((crumb, idx) => (
            <li
              key={idx}
              className={`${styles.breadcrumbs__item} ${darkModeClass}`}
            >
              <Crumb {...crumb} key={idx} last={crumb.last} />
            </li>
          ))}
      </ul>
    </div>
  )
}

export default Breadcrumbs
