"use client";
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation';
import ActivitiesPage from "./activities/page";

export default function Home() {
  const router = useRouter();

  return (
    <>
      <ActivitiesPage />
    </>
  );
}


console.log("GROS CACA BOUDIN QUI PUE DE RACISTE")
