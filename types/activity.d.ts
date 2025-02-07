declare global {
  interface Activity {
    id: string;
    name: string;
    type: {
      id: string;
      name: string;
    } | null;
    available_places: number;
    description: string;
    duration: number;
    datetime_debut: Date;
    reservations: Reservation[];
    image: string;
  }

  interface ActivityType {
    id: string;
    name: string;
  }
  
}
 export { Activity }