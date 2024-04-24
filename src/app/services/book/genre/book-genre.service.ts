import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BookGenre } from 'src/app/shared/domain/book/book-genre/book-genre';
import { AbstractService } from 'src/app/services/abstract/abstract.service';
import { StringValues } from 'src/app/shared/utils/string-values';

/**
 * A service for managing book genre-related operations.
 * Extends the AbstractService class for common service functionalities.
 */
@Injectable({
  providedIn: 'root'
})
export class BookGenreService extends AbstractService<BookGenre, string> {
  /**
   * Constructor for the BookGenreService.
   * @param httpClient - The Angular HttpClient for making HTTP requests.
   */
  constructor(protected override httpClient: HttpClient) {
    super(StringValues.BASE_BOOK_GENRE_URL, httpClient);
  }
}
