import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailCountryComponent } from './detail-country.component';

describe('DetailCountryComponent', () => {
  let component: DetailCountryComponent;
  let fixture: ComponentFixture<DetailCountryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailCountryComponent]
    });
    fixture = TestBed.createComponent(DetailCountryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
