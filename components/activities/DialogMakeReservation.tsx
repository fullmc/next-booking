'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DialogMakeReservationProps {
  activityId: string;
  activityName?: string;
  onSuccess?: () => void;
}

export function DialogMakeReservation({ 
  activityId, 
  activityName, 
  onSuccess 
}: DialogMakeReservationProps) {
  const [loading, setLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleReserve = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activityId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de la réservation');
      }

      toast({
        title: "Réservation confirmée",
        description: "Votre réservation a été effectuée avec succès.",
      });

      if (onSuccess) onSuccess();
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
        Réserver
      </Button>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la réservation</DialogTitle>
            <DialogDescription>
              Voulez-vous confirmer la réservation {activityName ? `pour "${activityName}"` : "de cette activité"} ?
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
              onClick={handleReserve}
              disabled={loading}
            >
              {loading ? 'Réservation en cours...' : 'Confirmer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
} 