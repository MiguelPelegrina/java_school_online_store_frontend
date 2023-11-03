import { Country } from "./country/country";

export interface City {
  name: string,
  country: Country,
  active: boolean,
}
