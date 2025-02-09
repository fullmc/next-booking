'use client';

import { useState } from 'react';
import { signOut } from 'next-auth/react';
import { ShadcnButton } from "@/components/ui/button";
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function DialogDeleteAccount() {
  const [loading, setLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/user', {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression');
      }

      toast.success("Compte supprimé", {
        description: "Votre compte a été supprimé avec succès.",
      });

      signOut({ callbackUrl: '/' });
    } catch (error) {
      toast.error("Erreur", {
        description: error instanceof Error ? error.message : "Une erreur est survenue",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
      <DialogTrigger asChild>
        <ShadcnButton variant="destructive">Supprimer le compte</ShadcnButton>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-4">Supprimer le compte</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.
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
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? 'Suppression...' : 'Confirmer'}
          </ShadcnButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}