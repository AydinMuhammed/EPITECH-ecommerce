import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useApi } from './useApi'

type User = {
  username: string;
  // Ajoutez d'autres propriétés si nécessaire
};

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()
  const { fetchApi } = useApi()

  const checkAuthStatus = useCallback(async () => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const userData: User = await fetchApi('/api/users')
        setUser(userData)
        setIsLoggedIn(true)
      } catch (error) {
        console.error('Erreur lors de la vérification du statut d\'authentification:', error)
        await handleLogout()
      }
    }
  }, [fetchApi])

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
        await checkAuthStatus()
        return true
      }
    } catch (error) {
      console.error('Erreur de connexion:', error)
      return false
    }
  }

  const handleLogout = useCallback(async () => {
    localStorage.removeItem('token')
    setIsLoggedIn(false)
    setUser(null)
    router.push('/')
  }, [router])

  useEffect(() => {
    checkAuthStatus()
  }, [checkAuthStatus])

  return { isLoggedIn, user, handleLogin, handleLogout, checkAuthStatus }
}