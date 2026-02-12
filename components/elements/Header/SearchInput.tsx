'use client'
import { useUnit } from 'effector-react'
import { useRef, useState, useEffect } from 'react'
import Select from 'react-select'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { $mode } from '@/context/mode'
import { IOption, SelectOptionType } from '@/lib/types/common'
import {
  createSelectOption,
  removeClassNamesForOverlayAndBody,
  toggleClassNamesForOverlayAndBody,
} from '@/lib/utils/common'
import { $searchInputZIndex, setSearchInputZIndex } from '@/context/header'
import SearchSvg from '../SearchSvg/SearchSvg'
import { useDebounceCallback } from '@/hooks/useDebounceCallback'
import { getPartByNameFx, searchPartsFx } from '@/lib/api/boilerParts'
import { IBoilerPart } from '@/lib/types/boilerparts'
import {
  NoOptionsMessage,
  NoOptionsSpinner,
} from '../SelectOptionsMessage/SelectOptionsMessage'
import styles from '@/styles/header.module.scss'
import {
  controlStyles,
  inputStyles,
  menuStyles,
  optionStyles,
} from '@/styles/searchInput'

const SearchInput = () => {
  const mode = useUnit($mode)
  const zIndex = useUnit($searchInputZIndex)
  const [searchOption, setSearchOption] = useState<SelectOptionType>(null)
  const [onMenuOpenControlStyles, setOnMenuOpenControlStyles] = useState({})
  const [onMenuOpenContainerStyles, setOnMenuOpenContainerStyles] = useState({})
  const [isMounted, setIsMounted] = useState(false)
  const darkModeClass = mode === 'dark' ? `${styles.dark_mode}` : ''
  const btnRef = useRef<HTMLButtonElement>(null)
  const borderRef = useRef<HTMLSpanElement>(null)
  const [options, setOptions] = useState([])
  const [inputValue, setInputValue] = useState('')
  const delayCallback = useDebounceCallback(1000)
  const spinner = useUnit(searchPartsFx.pending)
  const router = useRouter()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleSearchOptionChange = (selectedOption: SelectOptionType) => {
    if (!selectedOption) {
      setSearchOption(null)
      return
    }

    const name = (selectedOption as IOption)?.value as string

    if (name) {
      getPartAndRedirect(name)
    }

    setSearchOption(selectedOption)
    removeClassNamesForOverlayAndBody()
  }

  const onFocusSearch = () => {
    toggleClassNamesForOverlayAndBody('open-search')
    setSearchInputZIndex(100)
  }

  const handleSearchClick = async () => {
    if (!inputValue) {
      return
    }

    getPartAndRedirect(inputValue)
  }

  const searchPart = async (search: string) => {
    try {
      setInputValue(search)
      const data = await searchPartsFx({
        url: '/boiler-parts/search',
        search,
      })

      const names = data
        .map((item: IBoilerPart) => item.name)
        .map(createSelectOption)

      setOptions(names)
    } catch (error) {
      toast.error((error as Error).message)
    }
  }

  const getPartAndRedirect = async (name: string) => {
    const part = await getPartByNameFx({
      url: '/boiler-parts/name',
      name,
    })

    if (!part.id) {
      toast.warning('Товар не найден.')
      return
    }

    router.push(`/catalog/${part.id}`)
  }

  const onSearchInputChange = (text: string) => {
    if (!isMounted) return

    document.querySelector('.overlay')?.classList.add('open-search')
    document.querySelector('.body')?.classList.add('overflow-hidden')

    delayCallback(() => searchPart(text))
  }

  const onSearchMenuOpen = () => {
    if (!isMounted) return

    setOnMenuOpenControlStyles({
      borderBottomLeftRadius: 0,
      border: 'none',
    })
    setOnMenuOpenContainerStyles({
      boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    })

    if (btnRef.current) {
      btnRef.current.style.border = 'none'
      btnRef.current.style.borderBottomRightRadius = '0'
    }
    if (borderRef.current) {
      borderRef.current.style.display = 'block'
    }
  }

  const onSearchMenuClose = () => {
    if (!isMounted) return

    setOnMenuOpenControlStyles({
      borderBottomLeftRadius: 4,
      boxShadow: 'none',
      border: '1px solid #9e9e9e',
    })
    setOnMenuOpenContainerStyles({
      boxShadow: 'none',
    })

    if (btnRef.current) {
      btnRef.current.style.border = '1px solid #9e9e9e'
      btnRef.current.style.borderLeft = 'none'
      btnRef.current.style.borderBottomRightRadius = '4px'
    }
    if (borderRef.current) {
      borderRef.current.style.display = 'none'
    }
  }

  if (!isMounted) {
    return (
      <>
        <div className={styles.header__search__inner}>
          <div
            style={{
              height: '40px',
              backgroundColor: mode === 'dark' ? '#2d2d2d' : '#ffffff',
            }}
          />
        </div>
        <button
          className={`${styles.header__search__btn} ${darkModeClass}`}
          style={{ zIndex: 1 }}
        >
          <span className={styles.header__search__btn__span}>
            <SearchSvg />
          </span>
        </button>
      </>
    )
  }

  return (
    <>
      <div className={styles.header__search__inner}>
        <Select
          components={{
            NoOptionsMessage: spinner ? NoOptionsSpinner : NoOptionsMessage,
          }}
          placeholder="Я ищу..."
          value={searchOption}
          onChange={handleSearchOptionChange}
          styles={{
            ...inputStyles,
            container: (defaultStyles) => ({
              ...defaultStyles,
              ...onMenuOpenContainerStyles,
            }),
            control: (defaultStyles) => ({
              ...controlStyles(defaultStyles, mode),
              backgroundColor: mode === 'dark' ? '#2d2d2d' : '#ffffff',
              zIndex,
              transition: 'none',
              ...onMenuOpenControlStyles,
            }),
            input: (defaultStyles) => ({
              ...defaultStyles,
              color: mode === 'dark' ? '#f2f2f2' : '#222222',
            }),
            menu: (defaultStyles) => ({
              ...menuStyles(defaultStyles, mode),
              zIndex,
              marginTop: '-1px',
            }),
            option: (defaultStyles, state) => ({
              ...optionStyles(defaultStyles, state, mode),
            }),
          }}
          isClearable={true}
          openMenuOnClick={false}
          onFocus={onFocusSearch}
          onMenuOpen={onSearchMenuOpen}
          onMenuClose={onSearchMenuClose}
          onInputChange={onSearchInputChange}
          options={options}
        />
        <span ref={borderRef} className={styles.header__search__border} />
      </div>
      <button
        className={`${styles.header__search__btn} ${darkModeClass}`}
        ref={btnRef}
        style={{ zIndex }}
        onClick={handleSearchClick}
      >
        <span className={styles.header__search__btn__span}>
          <SearchSvg />
        </span>
      </button>
    </>
  )
}

export default SearchInput
