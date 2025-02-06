'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ActivityDetails } from '@/components/activities/ActivityDetails';
import type { Activity } from '@/types/activity'; 

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

  if (loading) return <div className="container mx-auto py-8 px-4">Chargement...</div>;
  if (!activity) return <div className="container mx-auto py-8 px-4">Activité non trouvée</div>;

  return (
    <div className="container mx-auto py-8 px-4">
      <Link href="/activities" className="flex items-center gap-2 mb-6 text-primary hover:underline">
        <ArrowLeft size={20} />
        Retour aux activités
      </Link>
      <ActivityDetails activity={activity} />
    </div>
  );
}
