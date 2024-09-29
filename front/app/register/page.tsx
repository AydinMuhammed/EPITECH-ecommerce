'use client'

import { useState, useEffect } from 'react'
import { useApi } from '../../hooks/useApi'
import { useAuth } from '../../hooks/useAuth'
import { useRouter } from 'next/navigation'
import Navbar from '../../components/Navbar'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [formErrors, setFormErrors] = useState({
    firstname: '',
    lastname: '',
    password: '',
  })
  const { fetchApi, loading, error } = useApi()
  const { handleLogin, checkAuthAndRedirect } = useAuth()
  const router = useRouter()

  useEffect(() => {
    checkAuthAndRedirect('/')
  }, [checkAuthAndRedirect])

  const validateName = (name: string) => {
    return /^[A-Za-zÀ-ÿ-]+$/.test(name)
  }

  const handleFirstnameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFirstname(value)
    if (!validateName(value)) {
      setFormErrors(prev => ({ ...prev, firstname: 'Le prénom ne doit contenir que des lettres et des tirets.' }))
    } else {
      setFormErrors(prev => ({ ...prev, firstname: '' }))
    }
  }

  const handleLastnameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setLastname(value)
    if (!validateName(value)) {
      setFormErrors(prev => ({ ...prev, lastname: 'Le nom ne doit contenir que des lettres et des tirets.' }))
    } else {
      setFormErrors(prev => ({ ...prev, lastname: '' }))
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPassword(value)
    if (confirmPassword && value !== confirmPassword) {
      setFormErrors(prev => ({ ...prev, password: 'Les mots de passe ne correspondent pas.' }))
    } else {
      setFormErrors(prev => ({ ...prev, password: '' }))
    }
  }

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setConfirmPassword(value)
    if (value !== password) {
      setFormErrors(prev => ({ ...prev, password: 'Les mots de passe ne correspondent pas.' }))
    } else {
      setFormErrors(prev => ({ ...prev, password: '' }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setFormErrors(prev => ({ ...prev, password: 'Les mots de passe ne correspondent pas.' }))
      return
    }
    if (formErrors.firstname || formErrors.lastname || formErrors.password) {
      return
    }
    try {
      const data = await fetchApi('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, firstname, lastname, password }),
      })
      console.log('Inscription réussie', data)
      if (data.message === 'User registered successfully') {
        // Connexion automatique après l'inscription
        const loginSuccess = await handleLogin(email, password)
        if (loginSuccess) {
          router.push('/')
        }
      }
    } catch (err) {
      console.error('Erreur d\'inscription', err)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Créer un compte
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
                <label htmlFor="firstname" className="sr-only">
                  Prénom
                </label>
                <input
                  id="firstname"
                  name="firstname"
                  type="text"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Prénom"
                  value={firstname}
                  onChange={handleFirstnameChange}
                />
              </div>
              {formErrors.firstname && <p className="mt-2 text-sm text-red-600">{formErrors.firstname}</p>}
              <div>
                <label htmlFor="lastname" className="sr-only">
                  Nom
                </label>
                <input
                  id="lastname"
                  name="lastname"
                  type="text"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Nom"
                  value={lastname}
                  onChange={handleLastnameChange}
                />
              </div>
              {formErrors.lastname && <p className="mt-2 text-sm text-red-600">{formErrors.lastname}</p>}
              <div>
                <label htmlFor="password" className="sr-only">
                  Mot de passe
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Mot de passe"
                  value={password}
                  onChange={handlePasswordChange}
                />
              </div>
              <div>
                <label htmlFor="confirm-password" className="sr-only">
                  Confirmer le mot de passe
                </label>
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Confirmer le mot de passe"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                />
              </div>
              {formErrors.password && <p className="mt-2 text-sm text-red-600">{formErrors.password}</p>}
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={loading || Object.values(formErrors).some(error => error !== '')}
              >
                {loading ? 'Inscription en cours...' : 'S\'inscrire'}
              </button>
            </div>
          </form>
          {error && <p className="mt-2 text-center text-sm text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  )
}