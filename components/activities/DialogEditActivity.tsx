'use client';

import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Edit } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface Activity {
  id: string;
  name: string;
  typeId?: string;
  type: {
    id: string;
    name: string;
  };
  available_places: number;
  description: string;
  duration: number;
  datetime_debut: Date;
}

interface DialogEditActivityProps {
  activity: Activity;
  onUpdate: () => void;
}

export function DialogEditActivity({ activity, onUpdate }: DialogEditActivityProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    ...activity,
    type: activity.type?.name || '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`/api/activities/${activity.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          typeId: activity.typeId,
        }),
      });

      if (!response.ok) throw new Error('Erreur lors de la mise à jour');
      
      onUpdate();
      setIsOpen(false);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button className="text-blue-600 hover:text-blue-800">
          <Edit size={20} />
        </button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Modifier l'activité</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-8">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nom de l'activité</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Type</label>
            <Input
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Places disponibles</label>
            <Input
              type="number"
              value={formData.available_places}
              onChange={(e) => setFormData({ ...formData, available_places: parseInt(e.target.value) })}
              required
              min={0}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Durée (en minutes)</label>
            <Input
              type="number"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
              required
              min={0}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Date et heure de début</label>
            <Input
              type="datetime-local"
              value={new Date(formData.datetime_debut).toISOString().slice(0, 16)}
              onChange={(e) => setFormData({ ...formData, datetime_debut: new Date(e.target.value) })}
              required
            />
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Mise à jour...' : 'Enregistrer'}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
} 