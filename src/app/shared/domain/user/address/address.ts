import { User } from "../user";
import { PostalCode } from "./postal-code/postal-code";

export interface Address {
  id: number,
  postalCode: PostalCode,
  user: User,
  street: string,
  number: number,
  active: boolean,
}
