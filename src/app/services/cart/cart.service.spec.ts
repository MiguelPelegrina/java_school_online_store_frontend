import { TestBed } from '@angular/core/testing';

import { CartService } from './cart.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';

describe('CartService', () => {
  let service: CartService;

  beforeEach(() => {
    TestBed.configureTestingModule({imports:[MatSnackBarModule]});
    service = TestBed.inject(CartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
