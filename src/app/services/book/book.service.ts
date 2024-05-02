import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { Book } from 'src/app/shared/domain/book/book';
import { AbstractService } from 'src/app/shared/services/abstract/abstract.service';
import { StringValues } from 'src/app/shared/utils/string-values';
import { buildQueryParams } from 'src/app/shared/utils/utils';

/**
 * A service for managing book-related operations.
 * Extends the AbstractService class for common service functionalities.
 */
@Injectable({
  providedIn: 'root'
})
export class BookService extends AbstractService<Book, number> {
  /**
   * Constructor for the BookService.
   *
   * @param httpClient - The Angular HttpClient for making HTTP requests.
   * @param queryBuilderService - The service for building query parameters.
   */
  constructor(
    protected override httpClient: HttpClient
  ) {
    super(StringValues.BASE_BOOK_URL, httpClient);
  }

  /**
   * Creates a new books in the API.
   * @param instances - The Book objects to be created.
   * @returns An Observable of the created Book objects.
   */
  createAll(books: Book[]): Observable<Book[]>{
    return this.httpClient.post<Book[]>(this.baseUrl + "/save_all", books).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Retrieves a list of books based on optional query parameters.
   * @param active - Optional. Filters books based on their active status.
   * @param filter - Optional. Filters books based on a search term.
   * @param sortType - Optional. Specifies the sort order (asc or desc).
   * @param sortProperty - Optional. Specifies the property to sort by.
   * @param page - Optional. Specifies the page number for pagination.
   * @param size - Optional. Specifies the number of items per page for pagination.
   * @param genre - Optional. Filters books based on the genre.
   * @returns An Observable containing the list of books matching the specified criteria.
   */
  override getAll(
    active?: boolean,
    filter?: string,
    sortType?: string,
    sortProperty?: string,
    page?: number,
    size?: number,
    genre?: string
  ): Observable<any> {
    const queryParams = buildQueryParams({
      active,
      name: filter,
      sortType,
      sortProperty,
      page,
      size,
      genre
    });

    const searchUrl = `${this.baseUrl}/search${queryParams}`;

    return this.httpClient.get<any>(searchUrl).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Retrieves a list of top products based on the specified limit.
   * @param number - The limit of top products to retrieve.
   * @returns An Observable containing the list of top products.
   */
  getTopProducts(number: number): Observable<any> {
    const topProductsUrl = `${this.baseUrl}/top_products?limit=${number}`;

    return this.httpClient.get<any>(topProductsUrl).pipe(
      catchError(this.handleError)
    );
  }
}
