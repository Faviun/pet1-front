'use client'
import { getBoilerPartsFx } from '@/lib/api/boilerParts'
import FilterSelect from '@/components/modules/CatalogPage/FilterSelect'
import ManufacturersBlock from '@/components/modules/CatalogPage/ManufacturersBlock'
import {
  $boilerManufacturers,
  $boilerParts,
  $filteredBoilerParts,
  $partsManufacturers,
  setBoilerManufacturers,
  setBoilerParts,
  setPartsManufacturers,
  updateBoilerManufacturer,
  updatePartsManufacturer,
} from '@/context/boilerParts'
import { $mode } from '@/context/mode'
import styles from '@/styles/catalog.module.scss'
import { useUnit } from 'effector-react'
import { AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import skeletonStyles from '@/styles/skeleton.module.scss'
import CatalogItem from '@/components/modules/CatalogPage/CatalogItem'
import ReactPaginate from 'react-paginate'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { IBoilerParts } from '@/lib/types/boilerparts'
import CatalogFilters from '@/components/modules/CatalogPage/CatalogFilters'
import { usePopup } from '@/hooks/usePoup'
import { checkQueryParams } from '@/lib/utils/catalog'
import FilterSvg from '@/components/elements/FilterSvg/FilterSvg'

const CatalogPage = () => {
  const mode = useUnit($mode)
  const boilerManufacturers = useUnit($boilerManufacturers)
  const partsManufacturers = useUnit($partsManufacturers)
  const filteredBoilerParts = useUnit($filteredBoilerParts)
  const boilerParts = useUnit($boilerParts)
  const [spinner, setSpinner] = useState(false)
  const [priceRange, setPriceRange] = useState([1000, 9000])
  const [isFilterInQuery, setIsFilterInQuery] = useState(false)
  const [isPriceRangeChanged, setIsPriceRangeChanged] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)

  const pagesCount = Math.ceil(boilerParts.count / 20)
  const darkModeClass = mode === 'dark' ? `${styles.dark_mode}` : ''
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const offsetParam = searchParams.get('offset')
  const isValidOffset = offsetParam && !isNaN(+offsetParam) && +offsetParam > 0

  const isAnyBoilerManufacturerChecked = boilerManufacturers.some(
    (item) => item.checked
  )
  const isAnyPartsManufacturerChecked = partsManufacturers.some(
    (item) => item.checked
  )
  const resetFilterBtnDisabled = !(
    isPriceRangeChanged ||
    isAnyBoilerManufacturerChecked ||
    isAnyPartsManufacturerChecked
  )
  const { toggleOpen, open, closePopup } = usePopup()

  useEffect(() => {
    if (isValidOffset) {
      setCurrentPage(+offsetParam - 1)
    }
    loadBoilerParts()
  }, [filteredBoilerParts, isFilterInQuery])

  useEffect(() => {
    if (offsetParam && isValidOffset) {
      setCurrentPage(+offsetParam - 1)
    }
  }, [offsetParam])

  const loadBoilerParts = async () => {
    try {
      setSpinner(true)
      const data = await getBoilerPartsFx('/boiler-parts?limit=20&offset=0')

      if (!isValidOffset) {
        const newSearchParams = new URLSearchParams(searchParams.toString())
        newSearchParams.set('offset', '1')
        router.push(`${pathname}?${newSearchParams.toString()}`)

        resetPagination(data)
        return
      }

      if (isValidOffset) {
        if (+offsetParam > Math.ceil(data.count / 20)) {
          const newSearchParams = new URLSearchParams(searchParams.toString())
          newSearchParams.set('offset', '1')
          router.push(`${pathname}?${newSearchParams.toString()}`)

          setCurrentPage(0)
          setBoilerParts(isFilterInQuery ? filteredBoilerParts : data)
          return
        }

        const offset = +offsetParam - 1
        const result = await getBoilerPartsFx(
          `/boiler-parts?limit=20&offset=${offset}`
        )

        setCurrentPage(offset)
        setBoilerParts(isFilterInQuery ? filteredBoilerParts : result)
        return
      }

      setCurrentPage(0)
      setBoilerParts(isFilterInQuery ? filteredBoilerParts : data)
    } catch (error) {
      toast.error((error as Error).message)
    } finally {
      setTimeout(() => setSpinner(false), 1000)
    }
  }

  const resetPagination = (data: IBoilerParts) => {
    setCurrentPage(0)
    setBoilerParts(data)
  }

  const handlePageChange = async ({ selected }: { selected: number }) => {
    try {
      setSpinner(true)
      const data = await getBoilerPartsFx('/boiler-parts?limit=20&offset=0')

      if (selected > pagesCount) {
        resetPagination(isFilterInQuery ? filteredBoilerParts : data)
        return
      }

      const { isValidBoilerQuery, isValidPartsQuery, isValidPriceQuery } =
        checkQueryParams(searchParams)

      const queryParams = []

      if (isFilterInQuery && isValidBoilerQuery) {
        const boiler = searchParams.get('boiler')
        if (boiler) queryParams.push(`boiler=${boiler}`)
      }

      if (isFilterInQuery && isValidPartsQuery) {
        const parts = searchParams.get('parts')
        if (parts) queryParams.push(`parts=${parts}`)
      }

      if (isFilterInQuery && isValidPriceQuery) {
        const priceFrom = searchParams.get('priceFrom')
        const priceTo = searchParams.get('priceTo')
        if (priceFrom && priceTo) {
          queryParams.push(`priceFrom=${priceFrom}`, `priceTo=${priceTo}`)
        }
      }

      const queryString =
        queryParams.length > 0 ? `&${queryParams.join('&')}` : ''

      const result = await getBoilerPartsFx(
        `/boiler-parts?limit=20&offset=${selected}${queryString}`
      )

      const newSearchParams = new URLSearchParams(searchParams.toString())
      newSearchParams.set('offset', String(selected + 1))
      router.push(`${pathname}?${newSearchParams.toString()}`)

      setCurrentPage(selected)
      setBoilerParts(result)
    } catch (error) {
      toast.error((error as Error).message)
    } finally {
      setTimeout(() => setSpinner(false), 1000)
    }
  }

  const resetFilters = async () => {
    try {
      const data = await getBoilerPartsFx('/boiler-parts?limit=20&offset=0')

      const newSearchParams = new URLSearchParams()

      if (offsetParam) {
        newSearchParams.set('offset', offsetParam)
      } else {
        newSearchParams.set('offset', '1')
      }

      newSearchParams.set('first', 'cheap')

      router.push(`${pathname}?${newSearchParams.toString()}`)

      setBoilerManufacturers(
        boilerManufacturers.map((item) => ({ ...item, checked: false }))
      )

      setPartsManufacturers(
        partsManufacturers.map((item) => ({ ...item, checked: false }))
      )

      setBoilerParts(data)
      setPriceRange([1000, 9000])
      setIsPriceRangeChanged(false)
      setIsFilterInQuery(false)
    } catch (error) {
      toast.error((error as Error).message)
    }
  }

  return (
    <section className={styles.catalog}>
      <div className={`container ${styles.catalog__container}`}>
        <h2 className={`${styles.catalog__title} ${darkModeClass}`}>
          Каталог товаров
        </h2>
        <div className={`${styles.catalog__top} ${darkModeClass}`}>
          <AnimatePresence>
            {isAnyBoilerManufacturerChecked && (
              <ManufacturersBlock
                title="Производитель котлов:"
                event={updateBoilerManufacturer}
                manufacturersList={boilerManufacturers}
              />
            )}
          </AnimatePresence>
          <AnimatePresence>
            {isAnyPartsManufacturerChecked && (
              <ManufacturersBlock
                title="Производитель запчастей:"
                event={updatePartsManufacturer}
                manufacturersList={partsManufacturers}
              />
            )}
          </AnimatePresence>
          <div className={styles.catalog__top__inner}>
            <button
              className={`${styles.catalog__top__reset} ${darkModeClass}`}
              disabled={resetFilterBtnDisabled}
              onClick={resetFilters}
            >
              Сбросить фильтр
            </button>
            <button
              className={styles.catalog__top__mobile_btn}
              onClick={toggleOpen}
            >
              <span className={styles.catalog__top__mobile_btn__svg}>
                <FilterSvg />
              </span>
              <span className={styles.catalog__top__mobile_btn__text}>
                Фильтр
              </span>
            </button>
            <FilterSelect setSpinner={setSpinner} />
          </div>
        </div>
        <div className={styles.catalog__bottom}>
          <div className={styles.catalog__bottom__inner}>
            <CatalogFilters
              priceRange={priceRange}
              setIsPriceRangeChanged={setIsPriceRangeChanged}
              setPriceRange={setPriceRange}
              resetFilterBtnDisabled={resetFilterBtnDisabled}
              resetFilters={resetFilters}
              isPriceRangeChanged={isPriceRangeChanged}
              currentPage={currentPage}
              setIsFilterInQuery={setIsFilterInQuery}
              closePopup={closePopup}
              filtersMobileOpen={open}
            />
            {spinner ? (
              <ul className={skeletonStyles.skeleton}>
                {Array.from(new Array(20)).map((_, i) => (
                  <li
                    key={i}
                    className={`${skeletonStyles.skeleton__item} ${
                      mode === 'dark' ? `${skeletonStyles.dark_mode}` : ''
                    }`}
                  >
                    <div className={skeletonStyles.skeleton__item__light} />
                  </li>
                ))}
              </ul>
            ) : (
              <ul className={styles.catalog__list}>
                {boilerParts.rows?.length ? (
                  boilerParts.rows.map((item) => (
                    <CatalogItem item={item} key={item.id} />
                  ))
                ) : (
                  <span>Список товаров пуст...</span>
                )}
              </ul>
            )}
          </div>
          <ReactPaginate
            containerClassName={styles.catalog__bottom__list}
            pageClassName={styles.catalog__bottom__list__item}
            pageLinkClassName={styles.catalog__bottom__list__item__link}
            previousClassName={styles.catalog__bottom__list__prev}
            nextClassName={styles.catalog__bottom__list__next}
            breakClassName={styles.catalog__bottom__list__break}
            breakLinkClassName={`${styles.catalog__bottom__list__break__link} ${darkModeClass}`}
            breakLabel="..."
            pageCount={pagesCount}
            forcePage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </section>
  )
}

export default CatalogPage
