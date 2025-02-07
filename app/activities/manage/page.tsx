'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { DialogEditActivity } from "@/components/activities/DialogEditActivity";
import { DialogCreateActivity } from "@/components/activities/DialogCreateActivity";
import { Reservation } from '@/types/reservations';
import { DialogDeleteActivity } from "@/components/activities/DialogDeleteActivity";

export default function ManageActivitiesPage() {
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.role !== 'ADMIN') {
      router.push('/activities');
    }
  }, [session, router]);

  const [activities, setActivities] = useState<Activity[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  
  const fetchActivities = async () => {
    const response = await fetch('/api/activities');
    const data = await response.json();
    setActivities(data);
  };

  const fetchReservations = async () => {
    try {
      const response = await fetch('/api/reservations');
      if (!response.ok) throw new Error('Erreur lors de la récupération des réservations');
      const data = await response.json();
      setReservations(data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
    fetchReservations();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette activité ?')) {
      try {
        const response = await fetch(`/api/activities/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setActivities(activities.filter(a => a.id !== id));
        }
      } catch (error) {
        console.error('Erreur:', error);
      }
    }
  };

  if (session?.user?.role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Gestion des activités</h1>
        <DialogCreateActivity 
          onSuccess={() => {
            fetchActivities();
          }}
        />
      </div>

      <div className="bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Titre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Places disponibles</th> 
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durée</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {activities.map((activity) => (
              <tr key={activity.id}>
                <td className="px-6 py-4">{activity.name}</td>
                <td className="px-6 py-4">
                  {activity.available_places - (reservations.filter(res => 
                    res.activity_id === activity.id && res.status 
                  ).length)} / {activity.available_places}
                </td>
                <td className="px-6 py-4">{activity.duration > 1 ? `${activity.duration} heures` : `${activity.duration} heure`}</td>
                <td className="">
                  <div className="flex gap-2">
                    <DialogEditActivity 
                      activity={activity}
                      onUpdate={() => {
                        fetchActivities();
                      }}
                    />
                    <DialogDeleteActivity
                      activityId={activity.id}
                      activityName={activity.name}
                      onDelete={handleDelete}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 