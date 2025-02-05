'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, Clock, MapPin, Euro } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

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
}

export default function ActivityDetailPage() {
  const params = useParams();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const response = await fetch(`/api/activities/${params.id}`);
        if (!response.ok) throw new Error('Erreur lors de la récupération');
        const data = await response.json();
        setActivity(data);
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchActivity();
    }
  }, [params.id]);

  if (loading) {
    return <div className="container mx-auto py-8 px-4">Chargement...</div>;
  }

  if (!activity) {
    return <div className="container mx-auto py-8 px-4">Activité non trouvée</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Link href="/activities" className="flex items-center gap-2 mb-6 text-primary hover:underline">
        <ArrowLeft size={20} />
        Retour aux activités
      </Link>
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl">{activity.name}</CardTitle>
          <CardDescription>{activity.type?.name}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="aspect-video relative bg-gray-100 rounded-lg">
            <img
              alt={activity.name}
              className="object-cover w-full h-full rounded-lg"
            />
          </div>
          <p className="text-gray-700">{activity.description}</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-semibold">Date de début:</span>
              <p>{new Date(activity.datetime_debut).toLocaleString()}</p>
            </div>
            <div>
              <span className="font-semibold">Durée:</span>
              <p>{activity.duration} minutes</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <span className="text-xl font-bold">{activity.available_places} places disponibles</span>
          <button className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition-colors">
            Réserver
          </button>
        </CardFooter>
      </Card>
    </div>
  );
}
