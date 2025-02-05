// TODO: Dialog pour créer une activité
'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ActivityType {
  id: string;
  name: string;
}

interface DialogCreateActivityProps {
  onSuccess: () => void;
}

export function DialogCreateActivity({ onSuccess }: DialogCreateActivityProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activityTypes, setActivityTypes] = useState<ActivityType[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    typeId: '',
    available_places: 0,
    description: '',
    duration: 0,
    datetime_debut: new Date().toISOString().slice(0, 16)
  });

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
      const response = await fetch('/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Erreur lors de la création');
      
      onSuccess();
      setIsOpen(false);
      setFormData({
        name: '',
        typeId: '',
        available_places: 0,
        description: '',
        duration: 0,
        datetime_debut: new Date().toISOString().slice(0, 16)
      });
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Nouvelle activité</Button>
      </DialogTrigger>
      <DialogContent className="w-[400px] sm:w-[540px]">
        <DialogHeader>
          <DialogTitle>Créer une nouvelle activité</DialogTitle>
        </DialogHeader>
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
              value={formData.datetime_debut}
              onChange={(e) => setFormData({ ...formData, datetime_debut: e.target.value })}
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
              {loading ? 'Création...' : 'Créer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
