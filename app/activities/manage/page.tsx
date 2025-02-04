'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Edit, Trash2, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { EditActivitySheet } from "@/components/activities/EditActivitySheet";

export default function ManageActivitiesPage() {
  const router = useRouter();
  const { data: session } = useSession();
  interface Activity {
    id: string;
    name: string;
    type: string;
    available_places: number;
    description: string;
    duration: number;
    datetime_debut: Date;
  }
  const [activities, setActivities] = useState<Activity[]>([]);
  
  useEffect(() => {
    const fetchActivities = async () => {
      const response = await fetch('/api/activities');
      const data = await response.json();
      setActivities(data);
    };
    fetchActivities();
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

  // Rediriger si non admin
  if (session?.user?.role !== 'ADMIN') {
    router.push('/activities');
    return null;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Gestion des activités</h1>
        <button
          onClick={() => router.push('/activities/manage/new')}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90"
        >
          <Plus size={20} />
          Nouvelle activité
        </button>
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
                <td className="px-6 py-4">{activity.available_places}</td>
                <td className="px-6 py-4">{activity.duration}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <EditActivitySheet 
                      activity={activity}
                      onUpdate={() => {
                        // Rafraîchir la liste des activités
                        fetchActivities();
                      }}
                    />
                    <button
                      onClick={() => handleDelete(activity.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={20} />
                    </button>
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