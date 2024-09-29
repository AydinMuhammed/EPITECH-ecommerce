'use client'

import { useState, useEffect } from 'react'
import { useApi } from '../../hooks/useApi'
import { useAuth } from '../../hooks/useAuth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '../../components/Navbar'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const { fetchApi, loading, error } = useApi()
  const { handleLogin, checkAuthAndRedirect } = useAuth()
  const router = useRouter()

  useEffect(() => {
    checkAuthAndRedirect('/')
  }, [checkAuthAndRedirect])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')  // Réinitialiser l'erreur de connexion
    try {
      const data = await fetchApi('/api/login_check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: email, password }),
      })
      console.log('Connexion réussie', data)
      if (data.token) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify({ username: email }))
        await handleLogin(email, password)
        router.push('/')
      } else {
        setLoginError('Échec de la connexion. Veuillez vérifier vos informations.')
      }
    } catch (err) {
      console.error('Erreur de connexion', err)
      if (err instanceof Error) {
        if (err.message.includes('401')) {
          setLoginError('Nom d\'utilisateur ou mot de passe incorrect.')
        } else {
          setLoginError('Une erreur est survenue lors de la connexion. Veuillez réessayer.')
        }
      } else {
        setLoginError('Une erreur inattendue est survenue. Veuillez réessayer.')
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Connexion à votre compte
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Adresse e-mail
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Adresse e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Mot de passe
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={loading}
              >
                {loading ? 'Connexion en cours...' : 'Se connecter'}
              </button>
            </div>
          </form>
          {loginError && <p className="mt-2 text-center text-sm text-red-600">{loginError}</p>}
          {error && <p className="mt-2 text-center text-sm text-red-600">{error}</p>}
          
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Pas encore de compte ?{' '}
              <Link href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                Créez-en un !
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}