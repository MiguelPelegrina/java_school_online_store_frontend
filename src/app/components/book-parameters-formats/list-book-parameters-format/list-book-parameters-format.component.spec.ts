import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListBookParametersFormatComponent } from './list-book-parameters-format.component';

describe('ListBookParametersFormatComponent', () => {
  let component: ListBookParametersFormatComponent;
  let fixture: ComponentFixture<ListBookParametersFormatComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListBookParametersFormatComponent]
    });
    fixture = TestBed.createComponent(ListBookParametersFormatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
