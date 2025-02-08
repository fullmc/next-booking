'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShadcnButton } from "@/components/ui/button";
import { toast } from "sonner";
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

      toast.success(`Annulation prise en compte.`, {
        description: `La réservation ${activityName} a été annulée avec succès.`,
      });

      onCancel();
      setShowConfirmDialog(false);
      router.push('/reservations');
    } catch (error) {
      toast.error("Une erreur est survenue", {
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de l'annulation",
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <ShadcnButton 
        onClick={() => setShowConfirmDialog(true)} 
        disabled={loading}
      >
        Annuler
      </ShadcnButton>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{activityName ? activityName : "Réservation"} </DialogTitle>
            <DialogDescription>
              Voulez-vous confirmer l'annulation de la réservation ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <ShadcnButton
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
            >
              Annuler
            </ShadcnButton>
            <ShadcnButton
              onClick={handleCancel}
              disabled={loading}
            >
              {loading ? 'Annulation en cours...' : 'Confirmer'}
            </ShadcnButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
} 