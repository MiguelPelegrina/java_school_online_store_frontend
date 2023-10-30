import { TestBed } from '@angular/core/testing';

import { BookFormatService } from './book-format.service';

describe('BookFormatService', () => {
  let service: BookFormatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookFormatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
