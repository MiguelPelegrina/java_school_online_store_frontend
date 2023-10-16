import { Address } from "./address/address";
import { UserRole } from "./user-role/user-role";

export interface User {
  id: number;
  name: string;
  surname: string;
  dateOfBirth: Date;
  email: string;
  password: string;
  isActive: boolean;
  phone: string;
  address: Address;
  roles: UserRole[];
}
