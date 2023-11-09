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

  // TODO Implement filter
  public override getAll(): Observable<any>{
    return this.httpClient.get<any>(`${this.baseUrl}/search`)
  }
}
