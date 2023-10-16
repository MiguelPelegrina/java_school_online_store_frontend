import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BookGenre } from 'src/app/shared/domain/book/book-genre/book-genre';
import { AbstractService } from 'src/app/shared/service/abstract.service';
import { StringValues } from 'src/app/shared/string-values';

@Injectable({
  providedIn: 'root'
})
export class BookGenreService extends AbstractService<BookGenre, string>{
  constructor(protected override httpClient: HttpClient) {
    super(StringValues.BASE_BOOK_GENRE_URL, httpClient);
   }
}
