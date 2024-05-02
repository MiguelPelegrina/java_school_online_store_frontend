import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { PaymentStatus } from 'src/app/shared/domain/order/payment-status/payment-status';
import { AbstractService } from 'src/app/shared/services/abstract/abstract.service';
import { StringValues } from 'src/app/shared/utils/string-values';
import { buildQueryParams } from 'src/app/shared/utils/utils';

/**
 * A service for managing payment status-related operations.
 * Extends the AbstractService class for common service functionalities.
 */
@Injectable({
  providedIn: 'root'
})
export class PaymentStatusService extends AbstractService<PaymentStatus, string> {
  /**
   * Constructor for the PaymentStatusService.
   * @param httpClient - The Angular HttpClient for making HTTP requests.
   * @param queryBuilderService - The service for building query parameters.
   */
  constructor(
    protected override httpClient: HttpClient
  ) {
    super(StringValues.BASE_PAYMENT_STATUS_URL, httpClient);
  }

  /**
   * Retrieves a list of payment statuses based on optional query parameters.
   * @param active - Optional. Filters payment statuses based on their active status.
   * @returns An Observable containing the list of payment statuses matching the specified criteria.
   */
  public override getAll(active?: boolean): Observable<any> {
    const queryParams = buildQueryParams({
      active
    });

    const searchUrl = `${this.baseUrl}/search${queryParams}`;

    return this.httpClient.get<any>(searchUrl).pipe(
      catchError(this.handleError)
    );
  }
}
