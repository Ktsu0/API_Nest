export interface User {
  id: string;
  email: string;
  password: string;
  firstName?: string;  // opcional
  lastName?: string;   // opcional
}