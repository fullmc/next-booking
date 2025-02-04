"use client";
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <>
      <h1>COUCOU JE SUIS RACISTE ET JE VEUX TOUT LE MONDE RACISTE ET VIVE ZEMMOUR</h1>
      <Button variant="outline" className="bg-red-500" onClick={() => router.push('/login')}>Login</Button>
      <Button variant="outline" className="bg-red-500" onClick={() => router.push('/register')}>Register</Button>
    </>
  );
}


console.log("GROS CACA BOUDIN QUI PUE DE RACISTE")
