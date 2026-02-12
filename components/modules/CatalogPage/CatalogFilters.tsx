'use client'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import CatalogFiltersDesktop from './CatalogFiltersDesktop'
import { ICatalogFiltersProps } from '@/lib/types/catalog'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import {
  $boilerManufacturers,
  $partsManufacturers,
  setBoilerManufacturersFromQuery,
  setPartsManufacturersFromQuery,
} from '@/context/boilerParts'
import { useUnit } from 'effector-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import CatalogFiltersMobile from './CatalogFiltersMobile'
import { checkQueryParams, updateParamsAndFilters } from '@/lib/utils/catalog'

const CatalogFilters = ({
  priceRange,
  setPriceRange,
  setIsPriceRangeChanged,
  resetFilterBtnDisabled,
  resetFilters,
  isPriceRangeChanged,
  currentPage,
  setIsFilterInQuery,
  closePopup,
  filtersMobileOpen,
}: ICatalogFiltersProps) => {
  const isMobile = useMediaQuery(820)
  const [spinner, setSpinner] = useState(false)
  const boilerManufacturers = useUnit($boilerManufacturers)
  const partsManufacturers = useUnit($partsManufacturers)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    applyFiltersFromQuery()
  }, [])

  const applyFiltersFromQuery = async () => {
    try {
      const {
        isValidBoilerQuery,
        isValidPartsQuery,
        isValidPriceQuery,
        boilerQueryValue,
        partsQueryValue,
        priceFromQueryValue,
        priceToQueryValue,
      } = checkQueryParams(searchParams)

      // Применяем фильтры из URL
      if (isValidPriceQuery) {
        updatePriceFromQuery(+priceFromQueryValue, +priceToQueryValue)
      }

      if (isValidBoilerQuery && boilerQueryValue.length > 0) {
        const encodedBoilerQuery = encodeURIComponent(
          JSON.stringify(boilerQueryValue)
        )
        setBoilerManufacturersFromQuery(encodedBoilerQuery)
      }

      if (isValidPartsQuery && partsQueryValue.length > 0) {
        const encodedPartsQuery = encodeURIComponent(
          JSON.stringify(partsQueryValue)
        )
        setPartsManufacturersFromQuery(encodedPartsQuery)
      }
    } catch (error) {
      const err = error as Error

      if (err.message === 'URI malformed') {
        toast.warning('Неправильный url для фильтров')
        return
      }

      toast.error(err.message)
    }
  }

  const updatePriceFromQuery = (priceFrom: number, priceTo: number) => {
    setIsFilterInQuery(true)
    setPriceRange([+priceFrom, +priceTo])
    setIsPriceRangeChanged(true)
  }

  const applyFilters = async () => {
    setIsFilterInQuery(true)
    try {
      setSpinner(true)
      const priceFrom = Math.ceil(priceRange[0])
      const priceTo = Math.ceil(priceRange[1])

      const boilers = boilerManufacturers
        .filter((item) => item.checked)
        .map((item) => item.title)

      const parts = partsManufacturers
        .filter((item) => item.checked)
        .map((item) => item.title)

      // Подготавливаем параметры для URL
      const params: Record<string, string> = {}

      // Добавляем фильтр цены если он изменен
      if (isPriceRangeChanged) {
        params.priceFrom = priceFrom.toString()
        params.priceTo = priceTo.toString()
      }

      // Добавляем фильтры производителей если есть выбранные
      if (boilers.length > 0) {
        params.boiler = encodeURIComponent(JSON.stringify(boilers))
      }

      if (parts.length > 0) {
        params.parts = encodeURIComponent(JSON.stringify(parts))
      }

      // Сбрасываем пагинацию при применении фильтров
      params.offset = '1'

      // Обновляем URL через функцию updateParamsAndFilters
      await updateParamsAndFilters(params, '', router, pathname, searchParams)
    } catch (error) {
      toast.error((error as Error).message)
    } finally {
      setSpinner(false)
    }
  }

  return (
    <>
      {isMobile ? (
        <CatalogFiltersMobile
          closePopup={closePopup}
          spinner={spinner}
          applyFilters={applyFilters}
          priceRange={priceRange}
          setIsPriceRangeChanged={setIsPriceRangeChanged}
          setPriceRange={setPriceRange}
          resetFilterBtnDisabled={resetFilterBtnDisabled}
          resetFilters={resetFilters}
          filtersMobileOpen={filtersMobileOpen}
        />
      ) : (
        <CatalogFiltersDesktop
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          setIsPriceRangeChanged={setIsPriceRangeChanged}
          resetFilterBtnDisabled={resetFilterBtnDisabled}
          spinner={spinner}
          resetFilters={resetFilters}
          applyFilters={applyFilters}
        />
      )}
    </>
  )
}

export default CatalogFilters
