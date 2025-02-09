import { User } from "./user";
import { Activity } from "./activities";
declare global {
  interface Reservation {
    id: string;
    user: User[];
    activity: Activity[];
    booking_date: Date;
    status: boolean;
    user_id: string;
    activity_id: string;
  }
}
 export { Reservation }
