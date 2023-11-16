import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { Order } from 'src/app/shared/domain/order/order';
import { OrderedBook } from 'src/app/shared/domain/order/ordered-book';
import { AbstractService } from 'src/app/shared/service/abstract.service';
import { QueryBuilderService } from 'src/app/shared/service/query-builder.service';
import { StringValues } from 'src/app/shared/utils/string-values';

/**
 * A service for managing order-related operations.
 * Extends the AbstractService class for common service functionalities.
 */
@Injectable({
  providedIn: 'root'
})
export class OrderService extends AbstractService<Order, number> {
  /**
   * Constructor for the OrderService.
   * @param httpClient - The Angular HttpClient for making HTTP requests.
   * @param queryBuilderService - The service for building query parameters.
   */
  constructor(
    protected override httpClient: HttpClient,
    private queryBuilderService: QueryBuilderService
  ) {
    super(StringValues.BASE_ORDER_URL, httpClient);
  }

  /**
   * Creates a new order with associated books.
   *
   * @param order - The order details.
   * @param orderedBooks - The list of books associated with the order.
   * @returns An Observable indicating the success of the operation.
   */
  public createOrderWithBooks(order: Order, orderedBooks: OrderedBook[]): Observable<any> {
    const body = JSON.stringify({ order, orderedBooks });

    return this.httpClient.post(
      `${StringValues.BASE_ORDER_URL}/withBooks`,
      body,
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Retrieves a list of orders based on optional query parameters.
   * @param filter - Optional. Filters orders based on a provided string.
   * @param sortType - Optional. Specifies the sorting type (asc/desc) for the results.
   * @param sortProperty - Optional. Specifies the property for sorting the results.
   * @param page - Optional. Specifies the page number for paginated results.
   * @param size - Optional. Specifies the page size for paginated results.
   * @returns An Observable containing the list of orders matching the specified criteria.
   */
  public override getAll(filter?: string, sortType?: string, sortProperty?: string, page?: number, size?: number): Observable<any> {
    const queryParams = this.queryBuilderService.buildQueryParams({
      name: filter,
      sortType: sortType || 'asc',
      sortProperty: sortProperty || 'date',
      page: page != null ? page : 0,
      size: size != null ? size : 20
    });

    const searchUrl = `${this.baseUrl}/search${queryParams}`;

    return this.httpClient.get<any>(searchUrl).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Retrieves revenue information for a specified date range.
   * @param startDate - The start date of the range.
   * @param endDate - The end date of the range.
   * @returns An Observable containing the revenue information for the specified date range.
   */
  public getRevenue(startDate: string, endDate: string): Observable<any> {
    const revenueUrl = `${this.baseUrl}/revenue?start=${startDate}&end=${endDate}`;

    return this.httpClient.get<any>(revenueUrl).pipe(
      catchError(this.handleError)
    );
  }
}
