'use client'
import { useUnit } from 'effector-react'
import { useEffect, useState } from 'react'
import Select from 'react-select'
import { $mode } from '@/context/mode'
import { controlStyles, menuStyles, selectStyles } from '@/styles/select'
import { optionStyles } from '@/styles/searchInput'
import { IOption, SelectOptionType } from '@/lib/types/common'
import { createSelectOption } from '@/lib/utils/common'
import { categoriesOptions } from '@/lib/utils/selectContents'
import {
  $boilerParts,
  setBoilerPartsByPopularity,
  setBoilerPartsCheapFirst,
  setBoilerPartsExpensiveFirst,
} from '@/context/boilerParts'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

const FilterSelect = ({
  setSpinner,
}: {
  setSpinner: (arg0: boolean) => void
}) => {
  const mode = useUnit($mode)
  const boilerParts = useUnit($boilerParts)
  const [categoryOption, setCategoryOption] = useState<SelectOptionType>(null)

  // App Router хуки
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Получаем параметр сортировки из URL
  const sortParam = searchParams.get('first')

  useEffect(() => {
    if (boilerParts.rows) {
      switch (sortParam) {
        case 'cheap':
          updateCategoryOption('Сначала дешевые')
          setBoilerPartsCheapFirst()
          break
        case 'expensive':
          updateCategoryOption('Сначала дорогие')
          setBoilerPartsExpensiveFirst()
          break
        case 'popular':
          updateCategoryOption('По популярности')
          setBoilerPartsByPopularity()
          break
        default:
          updateCategoryOption('Сначала дешевые')
          setBoilerPartsCheapFirst()
          break
      }
    }
  }, [boilerParts.rows, sortParam])

  const updateCategoryOption = (value: string) =>
    setCategoryOption({ value, label: value })

  const updateRouteParam = (first: string) => {
    // Создаем новые параметры URL
    const newSearchParams = new URLSearchParams(searchParams.toString())

    // Устанавливаем параметр сортировки
    if (first) {
      newSearchParams.set('first', first)
    } else {
      newSearchParams.delete('first')
    }

    // Обновляем URL
    const queryString = newSearchParams.toString()
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname

    router.push(newUrl)
  }

  const handleSortOptionChange = (selectedOption: SelectOptionType) => {
    setSpinner(true)
    setCategoryOption(selectedOption)

    switch ((selectedOption as IOption).value) {
      case 'Сначала дешевые':
        setBoilerPartsCheapFirst()
        updateRouteParam('cheap')
        break
      case 'Сначала дорогие':
        setBoilerPartsExpensiveFirst()
        updateRouteParam('expensive')
        break
      case 'По популярности':
        setBoilerPartsByPopularity()
        updateRouteParam('popular')
        break
      default:
        setBoilerPartsCheapFirst()
        updateRouteParam('cheap')
        break
    }

    setTimeout(() => setSpinner(false), 1000)
  }

  return (
    <Select
      placeholder="Сортировка..."
      value={categoryOption || createSelectOption('Сначала дешевые')}
      onChange={handleSortOptionChange}
      styles={{
        ...selectStyles,
        control: (defaultStyles) => ({
          ...controlStyles(defaultStyles, mode),
        }),
        input: (defaultStyles) => ({
          ...defaultStyles,
          color: mode === 'dark' ? '#f2f2f2' : '#222222',
        }),
        menu: (defaultStyles) => ({
          ...menuStyles(defaultStyles, mode),
        }),
        option: (defaultStyles, state) => ({
          ...optionStyles(defaultStyles, state, mode),
        }),
      }}
      isSearchable={false}
      options={categoriesOptions}
    />
  )
}

export default FilterSelect
