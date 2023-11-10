import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { Book } from 'src/app/shared/domain/book/book';
import { AbstractService } from 'src/app/shared/service/abstract.service';
import { StringValues } from 'src/app/shared/utils/string-values';

@Injectable({
  providedIn: 'root'
})
export class BookService extends AbstractService<Book, number>{
  constructor(protected override httpClient: HttpClient) {
    super(StringValues.BASE_BOOK_URL, httpClient);
  }

  public override getAll(active?: boolean, filter?: string, sortType?: string, sortProperty?: string, page?: number, size?: number, genre?: string): Observable<any> {
    // TODO
    // - Refactor this, maybe create some kind of RequestBuilder
    // - '&' should not appear if only one parameter is passed
    // - Add "?" only if at least one parameters is introduced -> create type with Request Params?
    const _active = active != null ? `/&active=${active}` : '';
    const _filter = filter != null ? `&name=${filter}` : '';
    const _sortType = sortType != null ? `&sortType=${sortType}` : '&sortType=asc';
    const _sortProperty = sortProperty != null ? `&sortProperty=${sortProperty}` : '&sortProperty=title';
    const _page = page != null || undefined ? `&page=${page}` : '&page=0';
    const _size = size != null || undefined ? `&size=${size}` : '&size=20';
    const _genre = genre != null || undefined ? `&genre=${genre}` : '';

    // console.log(`${this.baseUrl}${_active}${_filter}${_sortType}${_sortProperty}${_page}${_size}${_genre}`);
    return this.httpClient.get<any>(`${this.baseUrl}/search?${_active}${_filter}${_sortType}${_sortProperty}${_page}${_size}${_genre}`).pipe(
      // TODO Handle error
      // catchError(this.handleError)
    );
  }
}
