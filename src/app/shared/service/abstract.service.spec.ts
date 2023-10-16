import { TestBed } from '@angular/core/testing';

import { AbstractService } from './abstract.service';
import { Country } from '../domain/country/country';

describe('AbstractService', () => {
  let service: AbstractService<Country>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AbstractService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
