import { Injectable } from '@angular/core';
import { AbstractService } from '../../shared/service/abstract.service';
import { User } from '../../shared/domain/user/user';
import { HttpClient } from '@angular/common/http';
import { StringValues } from '../../shared/utils/string-values';
import { Observable, catchError } from 'rxjs';
import { QueryBuilderService } from 'src/app/shared/service/query-builder.service';

/**
 * A service for managing user-related operations.
 * Extends the AbstractService class for common service functionalities.
 */
@Injectable({
  providedIn: 'root'
})
export class UserService extends AbstractService<User, number>{
  /**
   * Constructor for the UserService.
   * @param httpClient - The Angular HttpClient for making HTTP requests.
   */
  constructor(protected override httpClient: HttpClient, private queryBuilderService: QueryBuilderService) {
    super(StringValues.BASE_USER_URL, httpClient);
  }

  /**
   * Retrieves a list of users based on optional query parameters.
   * @param active - Optional. Filters users based on their active status.
   * @param filter - Optional. Filters users based on a provided string.
   * @param sortType - Optional. Specifies the sorting type (asc/desc) for the results.
   * @param sortProperty - Optional. Specifies the property for sorting the results.
   * @param page - Optional. Specifies the page number for paginated results.
   * @param size - Optional. Specifies the page size for paginated results.
   * @returns An Observable containing the list of users matching the specified criteria.
   */
  public override getAll(
    active?: boolean,
    filter?: string,
    sortType?: string,
    sortProperty?: string,
    page?: number,
    size?: number
  ): Observable<any> {
    const queryParams = this.queryBuilderService.buildQueryParams({
      active,
      name: filter,
      sortType: sortType || 'asc',
      sortProperty: sortProperty || 'email',
      page: page != null ? page : 0,
      size: size != null ? size : 20
    });

    const searchUrl = `${this.baseUrl}/search${queryParams}`;

    return this.httpClient.get<any>(searchUrl).pipe(
      catchError(this.handleError)
    );
  }
}
