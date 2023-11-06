import { TestBed } from '@angular/core/testing';

import { OrderStatusService } from './order-status.service';

describe('OrderStatusService', () => {
  let service: OrderStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrderStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
