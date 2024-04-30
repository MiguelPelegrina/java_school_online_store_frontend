import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevenueCalculatorComponent } from './revenue-calculator.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('RevenueCalculatorComponent', () => {
  let component: RevenueCalculatorComponent;
  let fixture: ComponentFixture<RevenueCalculatorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RevenueCalculatorComponent],
      imports:[BrowserAnimationsModule, HttpClientTestingModule, MatCardModule, MatFormFieldModule, MatDatepickerModule, MatNativeDateModule],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(RevenueCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
