import { TestBed } from '@angular/core/testing';

import { BookFormatService } from './book-format.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('BookFormatService', () => {
  let service: BookFormatService;

  beforeEach(() => {
    TestBed.configureTestingModule({imports:[HttpClientTestingModule]});
    service = TestBed.inject(BookFormatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
