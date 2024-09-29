'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronRight, Utensils, Truck, Clock } from 'lucide-react'
import Navbar from '../components/Navbar'
import { useAuth } from '../hooks/useAuth'

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const { checkAuthStatus, isLoggedIn, user } = useAuth()

  useEffect(() => {
    setMounted(true)
    checkAuthStatus()
  }, [checkAuthStatus])

  if (!mounted) return null

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-blue-100">
      <Navbar />
      <main className="flex-grow">
        <section className="relative py-20 overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center">
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="lg:w-1/2 mb-12 lg:mb-0"
              >
                <h1 className="text-5xl lg:text-6xl font-extrabold text-blue-900 mb-6 leading-tight">
                  {isLoggedIn && user ? `Bienvenue ${user.username} chez` : 'Bienvenue chez'} <br />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
                    BOYS&apos; FINNY MEALS
                  </span>
                </h1>
                <p className="text-xl text-blue-800 mb-8">
                  Découvrez nos délicieux repas pour garçons, conçus pour nourrir leurs aventures !
                </p>
                <Link
                  href="/products"
                  className="inline-flex items-center px-6 py-3 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors duration-300"
                >
                  Voir nos menu
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="lg:w-1/2 relative"
              >
                <div className="relative w-full h-[400px] lg:h-[500px]">
                  <Image
                    src="/images/man-eating-pasta-2023-11-27-05-19-33-utc.jpg"
                    alt="Homme mangeant des pâtes"
                    fill
                    style={{ objectFit: 'cover' }}
                    className="rounded-3xl shadow-2xl"
                  />
                </div>
                <div className="absolute -bottom-10 -left-10 bg-white p-4 rounded-xl shadow-lg">
                  <Utensils className="h-8 w-8 text-blue-600 mb-2" />
                  <p className="font-semibold text-blue-900">Repas équilibrés</p>
                </div>
                <div className="absolute -top-10 -right-10 bg-white p-4 rounded-xl shadow-lg">
                  <Truck className="h-8 w-8 text-blue-600 mb-2" />
                  <p className="font-semibold text-blue-900">Livraison rapide</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-blue-900 mb-12">Pourquoi choisir BOYS&apos; FINNY MEALS ?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: Utensils, title: "Repas équilibrés", description: "Des menus conçus pour l'énergie et la croissance" },
                { icon: Truck, title: "Livraison rapide", description: "Vos repas livrés en temps record" },
                { icon: Clock, title: "Gain de temps", description: "Plus de temps pour jouer et s'amuser" }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-blue-50 p-6 rounded-xl text-center hover:shadow-lg transition-shadow duration-300"
                >
                  <feature.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-blue-900 mb-2">{feature.title}</h3>
                  <p className="text-blue-700">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}