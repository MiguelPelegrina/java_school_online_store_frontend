import { Injectable } from '@angular/core';
import { StringValues } from '../../shared/utils/string-values';
import { HttpClient } from '@angular/common/http';
import { Country } from '../../shared/domain/country/country';
import { AbstractService } from '../abstract/abstract.service';
import { Observable, catchError } from 'rxjs';
import { buildQueryParams } from 'src/app/shared/utils/utils';

/**
 * A service for managing country-related operations.
 * Extends the AbstractService class for common service functionalities.
 */
@Injectable({
  providedIn: 'root'
})
export class CountryService extends AbstractService<Country, string> {
  /**
   * Constructor for the CountryService.
   * @param httpClient - The Angular HttpClient for making HTTP requests.
   * @param queryBuilderService - The service for building query parameters.
   */
  constructor(
    protected override httpClient: HttpClient
  ) {
    super(StringValues.BASE_COUNTRY_URL, httpClient);
  }

  /**
   * Retrieves a list of countries based on optional query parameters.
   * @param active - Optional. Filters countries based on their active status.
   * @returns An Observable containing the list of countries matching the specified criteria.
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
