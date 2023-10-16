import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCountryComponent } from './list-country.component';

describe('ListCountryComponent', () => {
  let component: ListCountryComponent;
  let fixture: ComponentFixture<ListCountryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListCountryComponent]
    });
    fixture = TestBed.createComponent(ListCountryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
