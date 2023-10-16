import { UserRole } from "../user-role/user-role";

export interface Role {
  name: string,
  users: UserRole[],
}
