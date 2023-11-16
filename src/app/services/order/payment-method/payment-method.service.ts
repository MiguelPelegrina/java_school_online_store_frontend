import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { PaymentMethod } from 'src/app/shared/domain/order/payment-method/payment-method';
import { AbstractService } from 'src/app/shared/service/abstract.service';
import { QueryBuilderService } from 'src/app/shared/service/query-builder.service';
import { StringValues } from 'src/app/shared/utils/string-values';

/**
 * A service for managing payment method-related operations.
 * Extends the AbstractService class for common service functionalities.
 */
@Injectable({
  providedIn: 'root'
})
export class PaymentMethodService extends AbstractService<PaymentMethod, string> {
  /**
   * Constructor for the PaymentMethodService.
   * @param httpClient - The Angular HttpClient for making HTTP requests.
   * @param queryBuilderService - The service for building query parameters.
   */
  constructor(
    protected override httpClient: HttpClient,
    private queryBuilderService: QueryBuilderService
  ) {
    super(StringValues.BASE_PAYMENT_METHODS_URL, httpClient);
  }

  /**
   * Retrieves a list of payment methods based on optional query parameters.
   * @param active - Optional. Filters payment methods based on their active status.
   * @returns An Observable containing the list of payment methods matching the specified criteria.
   */
  public override getAll(active?: boolean): Observable<any> {
    const queryParams = this.queryBuilderService.buildQueryParams({
      active
    });

    const searchUrl = `${this.baseUrl}/search${queryParams}`;

    return this.httpClient.get<any>(searchUrl).pipe(
      catchError(this.handleError)
    );
  }
}
