'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const Custom404 = () => {
  const router = useRouter()

  const handleGoBack = () => {
    if (window.history.length > 2) {
      router.back()
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="flex-container">
      <div className="text-center">
        <h1>
          <span className="fade-in" id="digit1">
            4
          </span>
          <span className="fade-in" id="digit2">
            0
          </span>
          <span className="fade-in" id="digit3">
            4
          </span>
        </h1>
        <h3 className="fadeIn">Страница не найдена</h3>

        <button type="button" name="button" onClick={handleGoBack}>
          Вернуться назад
        </button>

        <Link href="/dashboard" passHref>
          <button type="button" name="button" style={{ marginLeft: '10px' }}>
            На главную
          </button>
        </Link>
      </div>
    </div>
  )
}

export default Custom404
