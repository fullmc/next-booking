import { Reservation } from "./reservations";

declare global {
  interface User {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    role: string;
    reservations: Reservation[];
  }
}

export { User }
