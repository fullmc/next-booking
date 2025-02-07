'use client';

import { Search } from "lucide-react"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { List } from 'lucide-react';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import { ShineBorder } from "@/components/magicui/shine-border";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { tagSeverityMapper } from '@/lib/utils';
interface Activity {
  id: string;
  name: string;
  type: {
    id: string;
    name: string;
  } | null;
  available_places: number;
  description: string;
  duration: number;
  datetime_debut: Date;
  image: string;
}

export default function ActivitiesPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
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
        setLoading(true);
      }
    };

    fetchActivities();
  }, []);

  // truncate description
  const maxLength = 150;

  const truncateDescription = (description: string) => {
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength) + '...';
  };

  // Obtenir les types uniques d'activités
  const uniqueTypes = Array.from(new Set(activities.map(activity => activity.type?.name))).filter(Boolean) as string[];


  const filteredActivities = activities.filter(activity =>
    (selectedType ? activity.type?.name === selectedType : true) &&
    (activity.name.toLowerCase().includes(search.toLowerCase()) ||
    activity.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="container mx-auto py-8 px-4">
      {/* En-tête et Recherche */}
      <div className="mb-12 space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold mb-4">Découvrez nos activités</h1>
          {isAdmin && (
            <Button
              onClick={() => router.push('/activities/manage')}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
            >
              <List size={20} />
              Gérer les activités
            </Button>
          )}
        </div>
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"  />
          <input
            type="text"
            placeholder="Rechercher une activité..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filtres rapides */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedType(null)}
            className={`px-4 py-2 rounded-full text-sm ${
              selectedType === null
                ? 'bg-primary text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            Tout ({activities.length})
          </button>
          {uniqueTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2 rounded-full text-sm ${
                selectedType === type
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {type} ({activities.filter(activity => activity.type?.name === type).length})
            </button>
          ))}
        </div>
      </div>

      {/* Grille d'activités */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredActivities.map((activity) => (
          <ShineBorder key={activity.id}>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video relative">
                <img
                  alt={activity.name}
                  className="object-cover w-full h-full"
                  src={activity.image}
                />
              </div>
              <div className="flex flex-col justify-between">
              <CardHeader>
                <div className="flex justify-between items-center">
                <CardTitle className="tracking-wide text-lg">{activity.name}</CardTitle>
                <CardDescription className="text-sm">
                  <Tag 
                    value={activity.type?.name} 
                    severity={tagSeverityMapper(activity.type?.name)}
                  />
                </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{truncateDescription(activity.description)}</p>
                <div className="mt-4 flex items-center gap-1 text-base text-gray-500 font-normal">
                  <span>⏱ {activity.duration}</span>
                  <span>{activity.duration > 1 ? 'heures' : 'heure'}</span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <div className="flex items-baseline gap-2">
                  {activity.available_places === 0 ? (
                    <span className="text-xl font-bold">COMPLET</span>
                  ) : (
                    <>
                      <span className="text-xl font-bold">{activity.available_places}</span>
                      <span>{activity.available_places > 1 ? 'places disponibles' : 'place disponible'}</span>
                    </>
                  )}
                </div>
                <Button label="Voir détails" onClick={() => router.push(`/activities/${activity.id}`)} className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors" />
              </CardFooter>
              </div>
            </Card>
          </ShineBorder>
        ))}
      </div>
    </div>
  )
}