'use client'
import { checkUserAuthFx } from '@/lib/api/auth'
import { setUser } from '@/context/user'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

const useRedirectByUserCheck = (isAuthPage = false) => {
  const [shouldLoadContent, setShouldLoadContent] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const shouldCheckAuth = useRef(true)

  useEffect(() => {
    const checkUser = async () => {
      try {
        setIsChecking(true)
        const user = await checkUserAuthFx('/users/login-check')

        if (isAuthPage) {
          if (!user) {
            setShouldLoadContent(true)
            setIsChecking(false)
            return
          }
          const redirectTo = searchParams.get('redirect') || '/dashboard'
          router.push(redirectTo)
          return
        }

        if (user) {
          setUser(user)
          setShouldLoadContent(true)
          setIsChecking(false)
          return
        }

        const returnUrl = encodeURIComponent(
          pathname +
            (searchParams.toString() ? `?${searchParams.toString()}` : '')
        )
        router.push(`/?redirect=${returnUrl}`)
      } catch (error) {
        console.error('Error checking user auth:', error)

        if (isAuthPage) {
          setShouldLoadContent(true)
        } else {
          router.push('/error?type=auth')
        }
        setIsChecking(false)
      }
    }

    if (shouldCheckAuth.current) {
      shouldCheckAuth.current = false
      checkUser()
    }
  }, [isAuthPage, router, pathname, searchParams])

  return {
    shouldLoadContent,
    isChecking,
  }
}

export default useRedirectByUserCheck
