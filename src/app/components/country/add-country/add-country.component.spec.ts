import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCountryComponent } from './add-country.component';

describe('AddCountryComponent', () => {
  let component: AddCountryComponent;
  let fixture: ComponentFixture<AddCountryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddCountryComponent]
    });
    fixture = TestBed.createComponent(AddCountryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
