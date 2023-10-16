import { Injectable } from '@angular/core';
import { StringValues } from '../../shared/string-values';
import { HttpClient } from '@angular/common/http';
import { Country } from '../../shared/domain/country/country';
import { AbstractService } from '../../shared/service/abstract.service';

@Injectable({
  providedIn: 'root'
})
export class CountryService extends AbstractService<Country, string> {
  // TODO Not sure if this is right
  constructor(protected override httpClient: HttpClient) {
    super(StringValues.BASE_COUNTRY_URL, httpClient);
  }
}
