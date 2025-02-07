'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
import { Button } from 'primereact/button';
import { ShadcnButton } from "@/components/ui/button";

interface DialogDeleteActivityProps {
  activityId: string;
  activityName: string;
  onDelete: (id: string) => void;
}

export function DialogDeleteActivity({ activityId, activityName, onDelete }: DialogDeleteActivityProps) {
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    onDelete(activityId);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
      <Button icon="pi pi-trash" rounded text severity="danger" aria-label="Cancel" className="text-red-500 hover:text-red-700" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmer la suppression</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          Êtes-vous sûr de vouloir supprimer l&apos;activité &quot;{activityName}&quot; ?
        </div>
        <DialogFooter>
          <ShadcnButton variant="outline" onClick={() => setOpen(false)}>
            Annuler
          </ShadcnButton>
          <ShadcnButton  onClick={handleDelete}>
            Supprimer
          </ShadcnButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
