import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDetailsFormComponent } from './order-details-form.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('OrderDetailsFormComponent', () => {
  let component: OrderDetailsFormComponent;
  let fixture: ComponentFixture<OrderDetailsFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrderDetailsFormComponent],
      imports:[HttpClientTestingModule]
    });
    fixture = TestBed.createComponent(OrderDetailsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
