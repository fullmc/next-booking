'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DialogMakeReservation } from '@/components/activities/DialogMakeReservation';
import { tagSeverityMapper } from '@/lib/utils';
import { Tag } from 'primereact/tag';
import { formatDate, formatTime, formatDuration } from '@/lib/formatters';
import { Activity } from '@/types/activity'
import { NeonGradientCard } from '@/components/magicui/neon-gradient-card';
interface ActivityDetailsProps {
  activity: Activity;
}

export function ActivityDetails({ activity }: ActivityDetailsProps) {
  const getGradientColors = (type: string | undefined) => {

    switch (type) {
      case 'Survival':
        return {
          firstColor: '#ff0000',
          secondColor: '#7f0000'
        };
      case 'Soft':
        return {
          firstColor: '#a7f3d0',
          secondColor: '#dbeafe'
        };
      case 'Hardcore':
        return {
          firstColor: '#ff8c00',
          secondColor: '#ff4500'
        };
      case 'Réaliste':
        return {
          firstColor: '#93c5fd',
          secondColor: '#fcd34d'
        };
      default:
        console.log('Type non reconnu, utilisation des couleurs par défaut');
        return {
          firstColor: '#93c5fd',
          secondColor: '#fcd34d'
        };
    }
  };

  const gradientColors = getGradientColors(activity.type?.name);

  return (
    <NeonGradientCard 
      className="max-w-3xl mx-auto"
      neonColors={gradientColors}
      blur="80px"
    >
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <CardTitle className="text-3xl tracking-wide">{activity.name}</CardTitle>
            <Tag 
              severity={tagSeverityMapper(activity.type?.name)} 
              value={activity.type?.name} 
            />
          </div>
        </div>

        <div className="flex items-baseline gap-2">
          {activity.available_places === 0 ? (
            <span className="text-xl font-bold text-red-600">COMPLET</span>
          ) : (
            <>
              <span className="text-xl font-bold">{activity.available_places}</span>
              <span>{activity.available_places > 1 ? 'places disponibles' : 'place disponible'}</span>
            </>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-semibold block">Date de début</span>
            <time dateTime={activity.datetime_debut.toString()}>
              {formatDate(activity.datetime_debut)} à {formatTime(activity.datetime_debut)}
            </time>
          </div>
          <div>
            <span className="font-semibold block">Durée</span>
            <span>{formatDuration(activity.duration)}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="aspect-video relative bg-gray-100 rounded-lg overflow-hidden">
          <img
            alt={activity.name}
            src={activity.image}
            className="object-cover w-full h-full"
          />
        </div>
        <p className="text-gray-700 leading-relaxed">{activity.description}</p>
      </CardContent>

      <CardFooter className="flex justify-end">
        <DialogMakeReservation 
          activityId={activity.id} 
          activityName={activity.name}
          activityType={activity.type?.name}
          available_places={activity.available_places}
        />
      </CardFooter>
    </NeonGradientCard>
  );
} 