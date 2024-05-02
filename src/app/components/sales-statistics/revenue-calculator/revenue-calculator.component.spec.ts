import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevenueCalculatorComponent } from './revenue-calculator.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';

describe('RevenueCalculatorComponent', () => {
  let component: RevenueCalculatorComponent;
  let fixture: ComponentFixture<RevenueCalculatorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RevenueCalculatorComponent],
      imports:[
        BrowserAnimationsModule, 
        ReactiveFormsModule,
        HttpClientTestingModule, 
        MatCardModule, 
        MatFormFieldModule, 
        MatDatepickerModule, 
        MatNativeDateModule],
    });
    fixture = TestBed.createComponent(RevenueCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
