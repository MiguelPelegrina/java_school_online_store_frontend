import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { PostalCode } from 'src/app/shared/domain/user/address/postal-code/postal-code';
import { AbstractService } from 'src/app/shared/services/abstract/abstract.service';
import { StringValues } from 'src/app/shared/utils/string-values';
import { buildQueryParams } from 'src/app/shared/utils/utils';

/**
 * A service for managing postal code-related operations.
 * Extends the AbstractService class for common service functionalities.
 */
@Injectable({
  providedIn: 'root'
})
export class PostalCodeService extends AbstractService<PostalCode, string>{
  /**
   * Constructor for the PostalCodeService.
   * @param httpClient - The Angular HttpClient for making HTTP requests.
   * @param queryBuilderService - The service for building query parameters.
   */
  constructor(protected override httpClient: HttpClient) {
    super(StringValues.BASE_POSTAL_CODE_URL, httpClient)
  }

  /**
   * Retrieves a list of postal codes based on optional query parameters.
   * @param active - Optional. Filters postal codes based on their active status.
   * @param cityName - Optional. Filters postal codes based on the city name.
   * @returns An Observable containing the list of postal codes matching the specified criteria.
   */
  public override getAll(active?: boolean, cityName?: string): Observable<any> {
    const queryParams = buildQueryParams({
      active,
      city_name: cityName
    });

    const searchUrl = `${this.baseUrl}/search${queryParams}`;

    return this.httpClient.get<any>(searchUrl).pipe(
      catchError(this.handleError)
    );
  }
}
