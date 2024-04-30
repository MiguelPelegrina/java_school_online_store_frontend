import { TestBed } from '@angular/core/testing';

import { OrderStatusService } from './order-status.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('OrderStatusService', () => {
  let service: OrderStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({imports:[HttpClientTestingModule]});
    service = TestBed.inject(OrderStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
