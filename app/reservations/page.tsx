'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DialogCancelReservation } from "@/components/activities/DialogCancelReservation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const cancelledReservations = reservations.filter(r => !r.status);

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Mes Réservations</h1>
      
      <Tabs defaultValue="confirmed" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="confirmed">
            Confirmées ({confirmedReservations.length})
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            Annulées ({cancelledReservations.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="confirmed" className="mt-6">
          <div className="grid gap-4">
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
          <div className="grid gap-4">
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
    <Card>
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
              onCancel={onCancel}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
} 