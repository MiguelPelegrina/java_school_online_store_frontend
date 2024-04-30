import { TestBed } from '@angular/core/testing';

import { BookGenreService } from './book-genre.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('BookGenreService', () => {
  let service: BookGenreService;

  beforeEach(() => {
    TestBed.configureTestingModule({imports:[HttpClientTestingModule]});
    service = TestBed.inject(BookGenreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
