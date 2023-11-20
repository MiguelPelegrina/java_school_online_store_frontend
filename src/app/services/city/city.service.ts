import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { City } from 'src/app/shared/domain/user/address/postal-code/city/city';
import { AbstractService } from 'src/app/shared/service/abstract.service';
import { QueryBuilderService } from 'src/app/shared/service/query-builder.service';
import { StringValues } from 'src/app/shared/utils/string-values';

/**
 * A service for managing city-related operations.
 * Extends the AbstractService class for common service functionalities.
 */
@Injectable({
  providedIn: 'root'
})
export class CityService extends AbstractService<City, string> {
  /**
   * Constructor for the CityService.
   * @param httpClient - The Angular HttpClient for making HTTP requests.
   * @param queryBuilderService - The service for building query parameters.
   */
  constructor(
    protected override httpClient: HttpClient,
    private queryBuilderService: QueryBuilderService
  ) {
    super(StringValues.BASE_CITY_URL, httpClient);
  }

  /**
   * Retrieves a list of cities based on optional query parameters.
   * @param active - Optional. Filters cities based on their active status.
   * @param name - Optional. Filters cities based on the country name.
   * @returns An Observable containing the list of cities matching the specified criteria.
   */
  public override getAll(active?: boolean, name?: string): Observable<any> {
    const queryParams = this.queryBuilderService.buildQueryParams({
      active,
      name: name
    });

    const searchUrl = `${this.baseUrl}/search${queryParams}`;

    return this.httpClient.get<any>(searchUrl).pipe(
      catchError(this.handleError)
    );
  }
}
