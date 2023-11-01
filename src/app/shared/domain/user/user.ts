import { Address } from "./address/address";
import { UserRole } from "./user-role/user-role";

export interface User {
  addresses: Address[];
  dateOfBirth: Date;
  email: string;
  id: number;
  isActive: boolean;
  name: string;
  password: string;
  phone: string;
  roles: UserRole[];
  surname: string;
}
