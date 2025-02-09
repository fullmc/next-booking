'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ShadcnButton } from "@/components/ui/button";
import { toast } from "sonner";
import { Message } from 'primereact/message';
import Link from 'next/link';
import { PulsatingButton } from '@/components/magicui/pulsating-button';
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
  activityType?: string;
  available_places: number;
  onSuccess?: () => void;
}

export function DialogMakeReservation({ 
  activityId, 
  activityName, 
  activityType,
  available_places,
  onSuccess 
}: DialogMakeReservationProps) {
  const [loading, setLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const handleClick = () => {
    if (!session) {
      setShowConfirmDialog(true);
      return;
    }
    setShowConfirmDialog(true);
  };

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

      toast.success("La réservation a été effectuée avec succès.", {
        description: "La réservation a été effectuée avec succès.",
      });

      if (onSuccess) onSuccess();
      setShowConfirmDialog(false);
      router.push('/reservations');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Une erreur est survenue", {
        description: "La réservation n'a pas été effectuée.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PulsatingButton
        onClick={handleClick}
        disabled={loading || available_places === 0}
        pulseColor="#6366F1"
      >
        Réserver
      </PulsatingButton>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="w-full max-w-md">
          {!session ? (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">Connexion requise</DialogTitle>
                <DialogDescription className="text-base font-normal">
                  Vous devez être connecté pour effectuer une réservation.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex-col gap-2 sm:flex-row">
                <Link href="/login" className="w-full sm:w-auto">
                  <ShadcnButton variant="outline" className="w-full border border-zinc-800" onClick={() => setShowConfirmDialog(false)}>
                    Se connecter
                  </ShadcnButton>
                </Link>
                <Link href="/register" className="w-full sm:w-auto">
                  <ShadcnButton variant="outline" className="w-full border border-zinc-800" onClick={() => setShowConfirmDialog(false)}>
                    Créer un compte
                  </ShadcnButton>
                </Link>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">Confirmer la réservation</DialogTitle>
                {activityType === 'Survival' && (
                  <Message 
                    severity="warn" 
                    text="Attention, pour public averti de 18 ans et plus." 
                    style={{ 
                      fontSize: '12px',
                      textAlign: 'left',
                      display: 'flex',
                      marginTop: '8px',
                      alignItems: 'center',
                      justifyContent: 'left',
                    }}
                  />
                )}
                <DialogDescription className="text-base font-normal">
                  Voulez-vous confirmer la réservation {activityName ? `pour "${activityName}"` : "de cette activité"} ?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-2 sm:gap-0">
                <ShadcnButton variant="outline" onClick={() => setShowConfirmDialog(false)}>
                  Annuler
                </ShadcnButton>
                <ShadcnButton onClick={handleReserve} disabled={loading}>
                  {loading ? 'Réservation en cours...' : 'Confirmer'}
                </ShadcnButton>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
} 