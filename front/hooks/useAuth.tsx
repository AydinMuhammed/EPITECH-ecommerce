import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useApi } from './useApi'

type User = {
  username: string;
};

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()
  const { fetchApi } = useApi()

  const checkAuthStatus = useCallback(async () => {
    const token = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    if (token && storedUser) {
      setUser(JSON.parse(storedUser))
      setIsLoggedIn(true)
    } else {
      setIsLoggedIn(false)
      setUser(null)
    }
  }, [])

  const handleLogin = async (username: string, password: string) => {
    try {
      const data = await fetchApi('/api/login_check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })
      if (data.token) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify({ username }))
        setUser({ username })
        setIsLoggedIn(true)
        return true
      }
    } catch (error) {
      console.error('Erreur de connexion:', error)
      return false
    }
  }

  const handleLogout = useCallback(async () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setIsLoggedIn(false)
    setUser(null)
    router.push('/')
  }, [router])

  const checkAuthAndRedirect = useCallback(async (redirectPath: string) => {
    await checkAuthStatus()
    if (isLoggedIn) {
      router.push(redirectPath)
      return true
    }
    return false
  }, [checkAuthStatus, isLoggedIn, router])

  useEffect(() => {
    checkAuthStatus()
  }, [checkAuthStatus])

  return { isLoggedIn, user, handleLogin, handleLogout, checkAuthStatus, checkAuthAndRedirect }
}