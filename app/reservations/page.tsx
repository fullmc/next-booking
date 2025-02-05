'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DialogCancelReservation } from "@/components/activities/DialogCancelReservation";
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

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Mes Réservations</h1>
      <div className="grid gap-4">
        {reservations.length === 0 ? (
          <p>Aucune réservation trouvée.</p>
        ) : (
          reservations.map((reservation) => (
            <Card key={reservation.id}>
              <CardHeader>
                <CardTitle>{reservation.activity.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">
                    Type: {reservation.activity.type.name}
                  </p>
                  <p className="text-sm">
                    Date: {format(new Date(reservation.activity.datetime_debut), 'PPP à HH:mm', { locale: fr })}
                  </p>
                  <p className="text-sm">
                    Durée: {reservation.activity.duration} minutes
                  </p>
                  <p className="text-sm">
                    Statut: {reservation.status ? 'Confirmée' : 'Annulée'}
                  </p>
                  {reservation.status && (
                    <DialogCancelReservation 
                      activityName={reservation.activity.name}
                      reservationId={reservation.id}
                      onCancel={() => fetchReservations()}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
} 