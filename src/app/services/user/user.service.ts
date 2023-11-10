import { Injectable } from '@angular/core';
import { AbstractService } from '../../shared/service/abstract.service';
import { User } from '../../shared/domain/user/user';
import { HttpClient } from '@angular/common/http';
import { StringValues } from '../../shared/utils/string-values';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService extends AbstractService<User, number>{
  constructor(protected override httpClient: HttpClient) {
    super(StringValues.BASE_USER_URL, httpClient);
  }

  public override getAll(active?: boolean, filter?: string, sortType?: string, sortProperty?: string, page?: number, size?: number): Observable<any> {
    // TODO
    // - Refactor this, maybe create some kind of RequestBuilder
    // - '&' should not appear if only one parameter is passed
    // - Add "?" only if at least one parameters is introduced -> create type with Request Params?
    const _active = active != null ? `/&active=${active}` : '';
    const _filter = filter != null ? `&name=${filter}` : '';
    const _sortType = sortType != null ? `&sortType=${sortType}` : '&sortType=asc';
    const _sortProperty = sortProperty != null ? `&sortProperty=${sortProperty}` : '&sortProperty=email';
    const _page = page != null || undefined ? `&page=${page}` : '&page=0';
    const _size = size != null || undefined ? `&size=${size}` : '&size=20';

    // console.log(`${this.baseUrl}${_active}${_filter}${_sortType}${_sortProperty}${_page}${_size}`);
    return this.httpClient.get<any>(`${this.baseUrl}/search?${_active}${_filter}${_sortType}${_sortProperty}${_page}${_size}`).pipe(
      // TODO Handle error
      // catchError(this.handleError)
    );
  }
}
