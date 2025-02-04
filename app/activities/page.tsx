'use client';

import { Search } from "lucide-react"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Plus } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface Activity {
  id: string;
  name: string;
  type: string;
  available_places: number;
  description: string;
  duration: number;
  datetime_debut: Date;
}

export default function ActivitiesPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'ADMIN';
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch('/api/activities');
        if (!response.ok) throw new Error('Erreur réseau');
        const data = await response.json();
        setActivities(data);
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const filteredActivities = activities.filter(activity =>
    activity.name.toLowerCase().includes(search.toLowerCase()) ||
    activity.description.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <div className="container mx-auto py-8 px-4">Chargement...</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* En-tête et Recherche */}
      <div className="mb-8 space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold">Découvrez nos activités</h1>
          {isAdmin && (
            <button
              onClick={() => router.push('/activities/manage')}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
            >
              <Plus size={20} />
              Gérer les activités
            </button>
          )}
        </div>
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
                alt={activity.name}
                className="object-cover w-full h-full"
              />
            </div>
            <CardHeader>
              <CardTitle>{activity.name}</CardTitle>
              <CardDescription>{activity.type}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{activity.description}</p>
              <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                <span>⏱ {activity.duration} heures </span>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <span className="text-xl font-bold">{activity.available_places} places disponibles</span>
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