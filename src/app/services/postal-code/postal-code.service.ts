import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PostalCode } from 'src/app/shared/domain/user/address/postal-code/postal-code';
import { AbstractService } from 'src/app/shared/service/abstract.service';
import { StringValues } from 'src/app/shared/utils/string-values';

@Injectable({
  providedIn: 'root'
})
export class PostalCodeService extends AbstractService<PostalCode, string>{
  constructor(protected override httpClient: HttpClient) {
    super(StringValues.BASE_POSTAL_CODE_URL, httpClient)
  }

  public override getAll(active?: boolean, cityName?: string): Observable<any>{
    const _active = active != null ? `/search?active=${active}` : '/search?';
    const _filter = cityName != null ? `&city_name=${cityName}` : '';

    // console.log(`${this.baseUrl}${_active}${_filter}`);
    return this.httpClient.get<any>(`${this.baseUrl}${_active}${_filter}`).pipe(
      // TODO Handle error
      // catchError(this.handleError)
    );
  }
}
