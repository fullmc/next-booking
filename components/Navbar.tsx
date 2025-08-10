'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { CircleUser, LogIn, LogOut, NotebookPen, Drama } from "lucide-react"
import { TypingAnimation } from "@/components/magicui/typing-animation";
import { ShadcnButton } from "@/components/ui/button";
import { useState, useEffect } from 'react';
import { Reservation } from "@/types/reservations";

export function Navbar() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [confirmedReservationsCount, setConfirmedReservationsCount] = useState<number>(0);

  useEffect(() => {
    if (session?.user) {
      fetch('/api/reservations')
        .then(res => res.json())
        .then(data => {
          const confirmedCount = data.filter((reservation: Reservation) => reservation.status === true).length;
          setConfirmedReservationsCount(confirmedCount);
        })
        .catch(console.error);
    }
  }, [session]);

  console.log(confirmedReservationsCount)

  const getLinkClassName = (path: string) => {
    const baseClass = "text-sm transition-all duration-300 hover:scale-110 flex items-center gap-2"
    return pathname === path ? `${baseClass} font-bold` : baseClass
  }

  return (
    <nav className="border-b bg-black text-white">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <TypingAnimation as="a" href="/" duration={300} className="tracking-widest text-2xl" >
          Vortex
        </TypingAnimation>

        <div className="flex items-center gap-6">
          <Link href="/activities" className={getLinkClassName('/activities')}>
            <Drama size={16} />
            Activités
          </Link>
          {session ? (
              <div className="flex items-center gap-8">
                <Link 
                  href="/reservations" 
                  className={getLinkClassName('/reservations')}
                >
                  <NotebookPen size={16} />
                  Mes réservations 
                </Link>
                <Link 
                  href="/account" 
                  className={getLinkClassName('/account')}
                >
                  <CircleUser size={16} />
                  Mon compte
                </Link>
                {session?.user?.role === 'ADMIN' && (
                  <Link 
                    href="/admin/dashboard" 
                    className={getLinkClassName('/admin/dashboard')}
                  >
                    Dashboard Admin
                  </Link>
                )}
                <ShadcnButton
                  onClick={() => signOut()}
                  className="text-sm transition-all duration-300 hover:scale-110 border-[1.5px] border-slate-400 rounded-md px-2 py-1 bg-transparent"
                >
                  <LogOut size={14} />
                  Déconnexion
                </ShadcnButton>
              </div>
          ) : (
            <div className="flex items-center gap-6">
              <Link
                href="/login"
                className="flex items-center gap-2 transition-all duration-300 border-[1.5px] border-white rounded-md px-2 py-1 hover:scale-105"
              >
                <LogIn size={14} />
                <span>Connexion</span>
              </Link>
              <Link
                href="/register"
                className="bg-white text-black px-4 py-1 rounded-md transition-all duration-300 hover:scale-110"
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