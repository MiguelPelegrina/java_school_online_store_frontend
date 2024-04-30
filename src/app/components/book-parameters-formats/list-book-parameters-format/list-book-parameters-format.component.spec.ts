import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListBookParametersFormatComponent } from './list-book-parameters-format.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ListBookParametersFormatComponent', () => {
  let component: ListBookParametersFormatComponent;
  let fixture: ComponentFixture<ListBookParametersFormatComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListBookParametersFormatComponent],
      imports:[HttpClientTestingModule]
    });
    fixture = TestBed.createComponent(ListBookParametersFormatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
