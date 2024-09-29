import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ShoppingCart, User as UserIcon, LogOut } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

export default function Navbar() {
  const { isLoggedIn, user, handleLogout } = useAuth()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleUnauthorized = (event: Event) => {
      if ((event as CustomEvent).detail === 'Session expirée. Veuillez vous reconnecter.') {
        handleLogout()
        setError('Votre session a expiré. Veuillez vous reconnecter.')
      }
    }

    window.addEventListener('unauthorized', handleUnauthorized)
    return () => {
      window.removeEventListener('unauthorized', handleUnauthorized)
    }
  }, [handleLogout])

  return (
    <nav className="bg-gradient-to-r from-blue-500 to-blue-700 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-2xl font-bold">
          BOYS&apos; FINNY MEALS
        </Link>
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-white hover:text-blue-200">
            Accueil
          </Link>
          {isLoggedIn && user ? (
            <>
              <span className="bg-blue-400 bg-opacity-30 px-3 py-1 rounded-full text-white font-medium">
                {user.username || 'Utilisateur'}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center text-white hover:text-blue-200 focus:outline-none"
              >
                <LogOut className="h-6 w-6 mr-1" />
                <span className="hidden sm:inline">Déconnexion</span>
              </button>
            </>
          ) : (
            <Link href="/login" className="text-white hover:text-blue-200">
              <UserIcon className="h-6 w-6" />
            </Link>
          )}
          <Link href="/products" className="text-white hover:text-blue-200">
            <ShoppingCart className="h-6 w-6" />
          </Link>
        </div>
      </div>
      {error && <p className="text-red-300 text-sm mt-2">{error}</p>}
    </nav>
  )
}