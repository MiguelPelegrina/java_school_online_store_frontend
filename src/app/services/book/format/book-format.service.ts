import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BookFormat } from 'src/app/shared/domain/book/parameters/book-parameters-format/book-parameters-format';
import { AbstractService } from 'src/app/shared/services/abstract/abstract.service';
import { StringValues } from 'src/app/shared/utils/string-values';

/**
 * A service for managing book format-related operations.
 * Extends the AbstractService class for common service functionalities.
 */
@Injectable({
  providedIn: 'root'
})
export class BookFormatService extends AbstractService<BookFormat, string> {
  /**
   * Constructor for the BookFormatService.
   * @param httpClient - The Angular HttpClient for making HTTP requests.
   */
  constructor(protected override httpClient: HttpClient) {
    super(StringValues.BASE_BOOK_FORMAT_URL, httpClient);
  }
}
