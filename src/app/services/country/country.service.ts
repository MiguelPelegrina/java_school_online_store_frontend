import { Injectable } from '@angular/core';
import { StringValues } from '../../shared/utils/string-values';
import { HttpClient } from '@angular/common/http';
import { Country } from '../../shared/domain/country/country';
import { AbstractService } from '../../shared/service/abstract.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CountryService extends AbstractService<Country, string> {
  // TODO Not sure if this is right
  constructor(protected override httpClient: HttpClient) {
    super(StringValues.BASE_COUNTRY_URL, httpClient);
  }

  public override getAll(active?: boolean): Observable<any>{
    const _active = active != null ? `/search?active=${active}` : '/search?';

    return this.httpClient.get<any>(`${this.baseUrl}${_active}`).pipe(
      // TODO Handle error
      // catchError(this.handleError)
    );
  }
}
