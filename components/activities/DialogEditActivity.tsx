'use client';

import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Edit } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from 'primereact/button';
import { ShadcnButton } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity } from '@/types/activity';

interface DialogEditActivityProps {
  activity: Activity;
  onUpdate: () => void;
}

export function DialogEditActivity({ activity, onUpdate }: DialogEditActivityProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    ...activity,
    typeId: activity.type?.id || '',
  });
  const [loading, setLoading] = useState(false);
  const [activityTypes, setActivityTypes] = useState<ActivityType[]>([]);

  const fetchActivityTypes = async () => {
    try {
      const response = await fetch('/api/activity-types');
      if (!response.ok) throw new Error('Erreur lors de la récupération des types');
      const data = await response.json();
      setActivityTypes(data);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  useEffect(() => {
    fetchActivityTypes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`/api/activities/${activity.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          typeId: formData.typeId,
        }),
      });

      if (!response.ok) throw new Error('Erreur lors de la mise à jour');
      toast.success("L'activité a été mise à jour avec succès.", {
        description: `Mise à jour de l'activité ${activity.name}`,
      });
      
      onUpdate();
      setIsOpen(false);
    } catch (error) {
      toast.error("Une erreur est survenue", {
        description: "L'activité n'a pas été mise à jour.",
      });
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          icon="pi pi-pencil" 
          text 
          className="text-sky-600 hover:text-sky-800" 
          aria-label="Edit" 
        />
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
              maxLength={36}
              placeholder="36 caractères max."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Type</label>
            <Select
              value={formData.typeId}
              onValueChange={(value) => setFormData({ ...formData, typeId: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un type" />
              </SelectTrigger>
              <SelectContent>
                {activityTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            <label className="text-sm font-medium">Durée (en heures)</label>
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

          <div className="space-y-2">
            <label className="text-sm font-medium">Image</label>
            <Input type="text" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} disabled placeholder="Prochainement..."/>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <ShadcnButton
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Annuler
            </ShadcnButton>
            <ShadcnButton type="submit" disabled={loading}>
              {loading ? 'Mise à jour...' : 'Enregistrer'}
            </ShadcnButton>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
} 