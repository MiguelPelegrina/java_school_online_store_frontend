import { TestBed } from '@angular/core/testing';

import { PaymentStatusService } from './payment-status.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PaymentStatusService', () => {
  let service: PaymentStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({imports:[HttpClientTestingModule]});
    service = TestBed.inject(PaymentStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
