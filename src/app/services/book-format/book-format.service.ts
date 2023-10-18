import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BookParametersFormat } from 'src/app/shared/domain/book/parameters/book-parameters-format/book-parameters-format';
import { AbstractService } from 'src/app/shared/service/abstract.service';
import { StringValues } from 'src/app/shared/utils/string-values';

@Injectable({
  providedIn: 'root'
})
export class BookFormatService extends AbstractService<BookParametersFormat, string> {

  constructor(protected override httpClient: HttpClient) {
    super(StringValues.BASE_BOOK_FORMAT_URL, httpClient);
  }
}
