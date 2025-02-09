'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DialogCancelReservation } from "@/components/activities/DialogCancelReservation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tag } from 'primereact/tag';
import { tagSeverityMapper } from '@/lib/utils';
import { formatDate, formatTime, formatDuration } from '@/lib/formatters';

interface Reservation {
  id: string;
  status: boolean;
  activity: {
    id: string;
    name: string;
    description: string;
    datetime_debut: string;
    duration: number;
    type: {
      name: string;
    };
  };
}

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

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
    fetchReservations();
  }, []);

  const confirmedReservations = reservations.filter(r => r.status);
  
  const cancelledReservations = reservations
    .filter(r => !r.status)
    .reduce((acc: Reservation[], current) => {
      const exists = acc.find(item => item.activity.id === current.activity.id);
      if (!exists) {
        acc.push(current);
      }
      return acc;
    }, []);

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Mes réservations</h1>
      
      <Tabs defaultValue="confirmed" className="w-full">
        <TabsList className="grid w-1/2 grid-cols-2">
          <TabsTrigger value="confirmed">
            Confirmées ({confirmedReservations.length})
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            Annulées ({cancelledReservations.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="confirmed" className="mt-6">
          <div className="flex flex-wrap gap-4">
            {confirmedReservations.length === 0 ? (
              <p>Aucune réservation confirmée.</p>
            ) : (
              confirmedReservations.map((reservation) => (
                <ReservationCard 
                  key={reservation.id} 
                  reservation={reservation}
                  onCancel={fetchReservations}
                />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="cancelled" className="mt-6">
          <div className="flex flex-wrap gap-4">
            {cancelledReservations.length === 0 ? (
              <p>Aucune réservation annulée.</p>
            ) : (
              cancelledReservations.map((reservation) => (
                <ReservationCard 
                  key={reservation.id} 
                  reservation={reservation}
                  onCancel={fetchReservations}
                />
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ReservationCard({ 
  reservation, 
  onCancel 
}: { 
  reservation: Reservation;
  onCancel: () => void;
}) {
  return (
    <div>
      <Card className="w-[500px]">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{reservation.activity.name}</CardTitle>
          <Tag 
              value={reservation.activity.type.name} 
              severity={tagSeverityMapper(reservation.activity.type.name)}
            />
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <div className="space-y-2">
            <span className="font-medium">Date de début : </span>
            <time dateTime={reservation.activity.datetime_debut}>
              {formatDate(new Date(reservation.activity.datetime_debut))} à {formatTime(new Date(reservation.activity.datetime_debut))}
            </time>
            <p className="font-medium">
              Durée :
              <span className="font-normal"> {reservation.activity.duration} heures</span>
            </p>
            <p className="font-medium">
              Statut :
              <span className="font-normal"> {reservation.status ? 'Confirmée ✅' : 'Annulée ❌'}</span>
            </p>
            {reservation.status && (
              <div className="flex justify-end">
                <DialogCancelReservation 
                  activityName={reservation.activity.name}
                  reservationId={reservation.id}
                  onCancel={onCancel}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 