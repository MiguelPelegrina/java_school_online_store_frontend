import { TestBed } from '@angular/core/testing';

import { AbstractService } from './abstract.service';
import { Country } from '../../shared/domain/country/country';

describe('AbstractService', () => {
  let service: AbstractService<Country, string>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AbstractService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
