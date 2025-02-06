'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DialogMakeReservation } from '@/components/activities/DialogMakeReservation';
import { tagSeverityMapper } from '@/lib/utils';
import { Tag } from 'primereact/tag';
import { formatDate, formatTime, formatDuration } from '@/lib/formatters';
import { Activity } from '@/types/activity';


interface ActivityDetailsProps {
  activity: Activity;
}

export function ActivityDetails({ activity }: ActivityDetailsProps) {
  const getAvailabilityText = (places: number) => {
    if (places > 1) return 'places disponibles';
    if (places === 1) return 'place disponible';
    return 'COMPLET';
  };

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <CardTitle className="text-3xl">{activity.name}</CardTitle>
            <Tag 
              severity={tagSeverityMapper(activity.type?.name)} 
              value={activity.type?.name} 
            />
          </div>
        </div>

        <div className="flex items-center gap-2 text-lg">
          <span className="font-bold">{activity.available_places}</span>
          <span>{getAvailabilityText(activity.available_places)}</span>
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
        />
      </CardFooter>
    </Card>
  );
} 