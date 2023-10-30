import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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

  public override getAll(active?: boolean, filter?: string): Observable<Book[]> {
    // TODO
    // - Add missing parameters
    // - Create some kind of RequestBuilder
    // - '&' should not appear if only one parameter is passed
    // - Add "?" only if at least one parameters is introduced -> create type with Request Params?
    // - "/search" is only temporally necessary
    console.log(`${this.baseUrl}${active != null ? `/search?active=${active}` : ''}${filter != null ? `&name=${filter}` : ''}`);
    return this.httpClient.get<Book[]>(`${this.baseUrl}${active != null ? `/search?active=${active}` : ''}${filter != null ? `&name=${filter}` : ''}`).pipe(
      // catchError(this.handleError)
    );
  }
}
