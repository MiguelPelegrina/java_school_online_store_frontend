import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderStatus } from 'src/app/shared/domain/order/order-status/order-status';
import { AbstractService } from 'src/app/shared/service/abstract.service';
import { StringValues } from 'src/app/shared/utils/string-values';

@Injectable({
  providedIn: 'root'
})
export class OrderStatusService extends AbstractService<OrderStatus, string>{
  constructor(protected override httpClient: HttpClient) {
    super(StringValues.BASE_ORDER_STATUSES_URL, httpClient);
  }

  public override getAll(active?: boolean): Observable<any>{
    const _active = active != null ? `/search?active=${active}` : '/search?';

    return this.httpClient.get<any>(`${this.baseUrl}${_active}`).pipe(
      // TODO Handle error
      // catchError(this.handleError)
    );
  }
}
