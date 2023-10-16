import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Book } from 'src/app/shared/domain/book/book';
import { AbstractService } from 'src/app/shared/service/abstract.service';
import { StringValues } from 'src/app/shared/string-values';

@Injectable({
  providedIn: 'root'
})
export class BookService extends AbstractService<Book, number>{
  constructor(protected override httpClient: HttpClient) {
    super(StringValues.BASE_BOOK_URL, httpClient);
  }
}
