import { Country } from "./country/country";

export interface City {
  name: string,
  countryName: Country,
  active: boolean,
}
