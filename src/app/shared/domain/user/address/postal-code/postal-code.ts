import { City } from "./city/city";

export interface PostalCode{
  code: string,
  city: City,
  active: boolean,
}
