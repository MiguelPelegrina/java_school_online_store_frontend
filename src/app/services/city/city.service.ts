import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { City } from 'src/app/shared/domain/user/address/postal-code/city/city';
import { AbstractService } from 'src/app/shared/service/abstract.service';
import { StringValues } from 'src/app/shared/utils/string-values';

@Injectable({
  providedIn: 'root'
})
export class CityService extends AbstractService<City, string> {
  constructor(protected override httpClient: HttpClient) {
    super(StringValues.BASE_CITY_URL, httpClient);
  }

  public override getAll(active?: boolean, countryName?: string): Observable<any>{
    const _active = active != null ? `/search?active=${active}` : '/search?';
    const _filter = countryName != null ? `&country_name=${countryName}` : '';

    // console.log(`${this.baseUrl}${_active}${_filter}`);
    return this.httpClient.get<any>(`${this.baseUrl}${_active}${_filter}`).pipe(
      // TODO Handle error
      // catchError(this.handleError)
    );
  }
}
