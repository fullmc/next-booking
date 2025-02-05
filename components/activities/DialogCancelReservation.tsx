'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DialogCancelReservationProps {
  reservationId: string;
  activityName?: string;
  onCancel: () => void;
}


export function DialogCancelReservation({ 
  reservationId, 
  activityName, 
  onCancel 
}: DialogCancelReservationProps) {
  const [loading, setLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleCancel = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/reservations/${reservationId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reservationId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la réservation');
      }

      toast({
        title: "Réservation annulée",
        description: "Votre réservation a été annulée avec succès.",
      });

      onCancel();
      setShowConfirmDialog(false);
      router.push('/reservations');
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <Button 
        onClick={() => setShowConfirmDialog(true)} 
        disabled={loading}
      >
        Annuler
      </Button>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{activityName ? activityName : "Réservation"} </DialogTitle>
            <DialogDescription>
              Voulez-vous confirmer l'annulation de la réservation ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
            >
              Annuler
            </Button>
            <Button
              onClick={handleCancel}
              disabled={loading}
            >
              {loading ? 'Annulation en cours...' : 'Confirmer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
} 