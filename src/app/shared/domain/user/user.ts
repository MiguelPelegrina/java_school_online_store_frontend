import { Address } from "./address/address";
import { UserRole } from "./user-role/user-role";

export interface User {
  active: boolean;
  address: Address;
  dateOfBirth: Date;
  email: string;
  id: number;
  name: string;
  password: string;
  phone: string;
  roles: UserRole[];
  surname: string;
}
