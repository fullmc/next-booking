'use client'

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { User, LogIn } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


export function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-semibold text-lg">
          NextBooking
        </Link>

        <div className="flex items-center gap-6">
          {/* <Link href="/activities" className="hover:text-primary transition-colors">
            Activités
          </Link> */}

          {session ? (
            <div className="flex items-center gap-4">
              {/* <Avatar>
                <AvatarFallback>
                  {session?.user?.name ? (
                    session.user.name.split(' ').map(n => n?.[0]).join('').toUpperCase()
                  ) : (
                    <img src="/account.svg" alt="Account" />
                  )}
                </AvatarFallback>
              </Avatar> */}
              
              <div className="flex items-center gap-2">
              <Link 
                  href="/reservations" 
                  className="text-sm hover:text-primary transition-colors"
                >
                  Mes réservations
                </Link>
                <Link 
                  href="/account" 
                  className="text-sm hover:text-primary transition-colors"
                >
                  Mon compte
                </Link>
                <button
                  onClick={() => signOut()}
                  className="text-sm text-red-600 hover:text-red-700 transition-colors"
                >
                  Déconnexion
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="flex items-center gap-2 hover:text-primary transition-colors border border-primary rounded-md px-2 py-1"
              >
                <LogIn size={14} />
                <span>Connexion</span>
              </Link>
              <Link
                href="/register"
                className="bg-primary text-white px-4 py-1 rounded-md hover:bg-primary/90 transition-colors"
              >
                Inscription
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}