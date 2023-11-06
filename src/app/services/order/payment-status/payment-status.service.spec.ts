import { TestBed } from '@angular/core/testing';

import { PaymentStatusService } from './payment-status.service';

describe('PaymentStatusService', () => {
  let service: PaymentStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaymentStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
