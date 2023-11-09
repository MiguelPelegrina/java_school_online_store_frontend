import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { Order } from 'src/app/shared/domain/order/order';
import { OrderedBook } from 'src/app/shared/domain/order/ordered-book';
import { AbstractService } from 'src/app/shared/service/abstract.service';
import { StringValues } from 'src/app/shared/utils/string-values';

@Injectable({
  providedIn: 'root'
})
export class OrderService extends AbstractService<Order, number>{
  constructor(protected override httpClient: HttpClient) {
    super(StringValues.BASE_ORDER_URL, httpClient);
  }

  // TODO Might be unnecessary?
  public createOrderWithBooks(order: Order, orderedBooks: OrderedBook[]){
    const body = JSON.stringify({order, orderedBooks});

    return this.httpClient.post(
      `${StringValues.BASE_ORDER_URL}/withBooks`,
      body,
    ).pipe(
      catchError(this.handleError)
    );
  }

  // TODO Implement advanced filter
  public override getAll(filter?: string, sortType?: string, sortProperty?: string, page?: number, size?: number): Observable<any>{
    // TODO
    // - Refactor this, maybe create some kind of RequestBuilder
    // - '&' should not appear if only one parameter is passed
    // - Add "?" only if at least one parameters is introduced -> create type with Request Params?
    const _filter = filter != null ? `&name=${filter}` : '';
    const _sortType = sortType != null ? `&sortType=${sortType}` : '&sortType=asc';
    const _sortProperty = sortProperty != null ? `&sortProperty=${sortProperty}` : '&sortProperty=date';
    const _page = page != null || undefined ? `&page=${page}` : '&page=0';
    const _size = size != null || undefined ? `&size=${size}` : '&size=20';

    return this.httpClient.get<any>(`${this.baseUrl}/search?${_filter}${_sortType}${_sortProperty}${_page}${_size}`)
  }
}
