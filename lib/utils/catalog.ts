import { ReadonlyURLSearchParams } from 'next/navigation'
import { setFilteredBoilerParts } from '@/context/boilerParts'
import { getBoilerPartsFx } from '../api/boilerParts'

export const idGenerator = () => {
  const S4 = () =>
    (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  return (
    S4() +
    S4() +
    '-' +
    S4() +
    '-' +
    S4() +
    '-' +
    S4() +
    '-' +
    S4() +
    S4() +
    S4()
  )
}

const createManufacturerCheckboxObj = (title: string) => ({
  title,
  checked: false,
  id: idGenerator(),
})

export const boilerManufacturers = [
  'Ariston',
  'Chaffoteaux&Maury',
  'Baxi',
  'Bongioanni',
  'Saunier Duval',
  'Buderus',
  'Strategist',
  'Henry',
  'Northwest',
].map(createManufacturerCheckboxObj)

export const partsManufacturers = [
  'Azure',
  'Gloves',
  'Cambridgeshire',
  'Salmon',
  'Montana',
  'Sensor',
  'Lesly',
  'Radian',
  'Gasoline',
  'Croatia',
].map(createManufacturerCheckboxObj)

const checkPriceFromQuery = (price: number) =>
  !isNaN(price) && price >= 0 && price <= 10000

export const checkQueryParams = (
  searchParams: URLSearchParams | ReadonlyURLSearchParams
) => {
  const priceFromQueryValue = searchParams.get('priceFrom') || ''
  const priceToQueryValue = searchParams.get('priceTo') || ''
  const boilerQueryValue = searchParams.get('boiler') || ''
  const partsQueryValue = searchParams.get('parts') || ''

  let parsedBoilerQueryValue: string[] = []
  let parsedPartsQueryValue: string[] = []

  try {
    if (boilerQueryValue) {
      parsedBoilerQueryValue = JSON.parse(decodeURIComponent(boilerQueryValue))
    }
  } catch (e) {
    console.error('Error parsing boiler query:', e)
  }

  try {
    if (partsQueryValue) {
      parsedPartsQueryValue = JSON.parse(decodeURIComponent(partsQueryValue))
    }
  } catch (e) {
    console.error('Error parsing parts query:', e)
  }

  const isValidBoilerQuery =
    Array.isArray(parsedBoilerQueryValue) && parsedBoilerQueryValue.length > 0
  const isValidPartsQuery =
    Array.isArray(parsedPartsQueryValue) && parsedPartsQueryValue.length > 0
  const isValidPriceQuery =
    checkPriceFromQuery(+priceFromQueryValue) &&
    checkPriceFromQuery(+priceToQueryValue)

  return {
    isValidBoilerQuery,
    isValidPartsQuery,
    isValidPriceQuery,
    priceFromQueryValue,
    priceToQueryValue,
    boilerQueryValue: parsedBoilerQueryValue,
    partsQueryValue: parsedPartsQueryValue,
    rawBoilerQueryValue: boilerQueryValue,
    rawPartsQueryValue: partsQueryValue,
  }
}

export const updateParamsAndFiltersFromQuery = async (
  callback: VoidFunction,
  path: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  router: any,
  pathname: string
) => {
  callback()

  const offsetMatch = path.match(/offset=(\d+)/)
  const offset = offsetMatch ? offsetMatch[1] : '0'

  const data = await getBoilerPartsFx(`/boiler-parts?limit=20&offset=${offset}`)
  setFilteredBoilerParts(data)

  const cleanPath = path.startsWith('?') ? path.substring(1) : path
  const queryString = cleanPath.includes('?') ? cleanPath : `?${cleanPath}`
  router.push(`${pathname}${queryString}`)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateParamsAndFilters<T extends Record<string, any>>(
  updatedParams: T,
  path: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  router: any,
  pathname: string,
  searchParams: URLSearchParams | ReadonlyURLSearchParams
) {
  const newSearchParams = new URLSearchParams(searchParams.toString())

  newSearchParams.delete('boiler')
  newSearchParams.delete('parts')
  newSearchParams.delete('priceFrom')
  newSearchParams.delete('priceTo')
  newSearchParams.delete('offset')

  Object.entries(updatedParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      newSearchParams.set(key, String(value))
    }
  })

  const queryString = newSearchParams.toString()
  const newUrl = queryString ? `${pathname}?${queryString}` : pathname
  router.push(newUrl)

  const offset = updatedParams.offset || '1'
  const data = await getBoilerPartsFx(`/boiler-parts?limit=20&offset=${offset}`)
  setFilteredBoilerParts(data)
}

export const encodeFilters = (filters: string[]): string => {
  return encodeURIComponent(JSON.stringify(filters))
}

export const decodeFilters = (encoded: string): string[] => {
  try {
    return JSON.parse(decodeURIComponent(encoded))
  } catch (e) {
    console.error('Error decoding filters:', e)
    return []
  }
}

export const createFilterUrl = (
  basePath: string,
  filters: {
    boiler?: string[]
    parts?: string[]
    priceFrom?: number
    priceTo?: number
    offset?: number
  }
): string => {
  const params = new URLSearchParams()

  if (filters.boiler && filters.boiler.length > 0) {
    params.set('boiler', encodeFilters(filters.boiler))
  }

  if (filters.parts && filters.parts.length > 0) {
    params.set('parts', encodeFilters(filters.parts))
  }

  if (filters.priceFrom !== undefined) {
    params.set('priceFrom', filters.priceFrom.toString())
  }

  if (filters.priceTo !== undefined) {
    params.set('priceTo', filters.priceTo.toString())
  }

  if (filters.offset !== undefined) {
    params.set('offset', filters.offset.toString())
  }

  const queryString = params.toString()
  return queryString ? `${basePath}?${queryString}` : basePath
}
