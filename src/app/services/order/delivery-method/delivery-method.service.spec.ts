import { TestBed } from '@angular/core/testing';

import { DeliveryMethodService } from './delivery-method.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DeliveryMethodService', () => {
  let service: DeliveryMethodService;

  beforeEach(() => {
    TestBed.configureTestingModule({imports:[HttpClientTestingModule]});
    service = TestBed.inject(DeliveryMethodService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
