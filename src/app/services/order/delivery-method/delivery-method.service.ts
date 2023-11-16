import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { DeliveryMethod } from 'src/app/shared/domain/order/delivery-method/delivery-method';
import { AbstractService } from 'src/app/shared/service/abstract.service';
import { QueryBuilderService } from 'src/app/shared/service/query-builder.service';
import { StringValues } from 'src/app/shared/utils/string-values';

/**
 * A service for managing delivery method-related operations.
 * Extends the AbstractService class for common service functionalities.
 */
@Injectable({
  providedIn: 'root'
})
export class DeliveryMethodService extends AbstractService<DeliveryMethod, string> {
  /**
   * Constructor for the DeliveryMethodService.
   * @param httpClient - The Angular HttpClient for making HTTP requests.
   * @param queryBuilderService - The service for building query parameters.
   */
  constructor(
    protected override httpClient: HttpClient,
    private queryBuilderService: QueryBuilderService
  ) {
    super(StringValues.BASE_DELIVERY_METHODS_URL, httpClient);
  }

  /**
   * Retrieves a list of delivery methods based on optional query parameters.
   * @param active - Optional. Filters delivery methods based on their active status.
   * @returns An Observable containing the list of delivery methods matching the specified criteria.
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

