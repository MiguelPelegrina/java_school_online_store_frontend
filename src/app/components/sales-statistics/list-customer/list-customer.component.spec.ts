import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCustomerComponent } from './list-customer.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ListCustomerComponent', () => {
  let component: ListCustomerComponent;
  let fixture: ComponentFixture<ListCustomerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListCustomerComponent],
      imports:[HttpClientTestingModule]
    });
    fixture = TestBed.createComponent(ListCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
