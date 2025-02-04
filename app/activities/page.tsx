'use client';

import { Search } from "lucide-react"
import { useState } from 'react'
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function ActivitiesPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  // Filtrer les activités en fonction du terme de recherche
  const filteredActivities = MOCK_ACTIVITIES.filter(activity =>
    activity.title.toLowerCase().includes(search.toLowerCase()) ||
    activity.description.toLowerCase().includes(search.toLowerCase()) ||
    activity.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto py-8 px-4">
      {/* En-tête et Recherche */}
      <div className="mb-8 space-y-4">
        <h1 className="text-4xl font-bold">Découvrez nos activités</h1>
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher une activité..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Grille d'activités */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredActivities.map((activity) => (
          <Card key={activity.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video relative">
              <img
                src={activity.image}
                alt={activity.title}
                className="object-cover w-full h-full"
              />
            </div>
            <CardHeader>
              <CardTitle>{activity.title}</CardTitle>
              <CardDescription>{activity.location}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{activity.description}</p>
              <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                <span>⏱ {activity.duration}</span>
                <span>📍 {activity.location}</span>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <span className="text-xl font-bold">{activity.price}€</span>
              <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors" onClick={() => router.push(`/activities/${activity.id}`)}>
                Voir détails
              </button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

const MOCK_ACTIVITIES = [
  {
    id: 1,
    title: "Cours de Tennis",
    description: "Apprenez le tennis avec des professionnels qualifiés",
    price: 45,
    duration: "1h30",
    location: "Paris 15ème",
    image: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    title: "Yoga en plein air",
    description: "Séance de yoga dans un cadre naturel et apaisant",
    price: 25,
    duration: "1h",
    location: "Parc Monceau",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80",
  },
  // Ajoutez d'autres activités ici
]