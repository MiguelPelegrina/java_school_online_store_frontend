import { TestBed } from '@angular/core/testing';

import { PaymentMethodService } from './payment-method.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PaymentMethodService', () => {
  let service: PaymentMethodService;

  beforeEach(() => {
    TestBed.configureTestingModule({imports:[HttpClientTestingModule]});
    service = TestBed.inject(PaymentMethodService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
