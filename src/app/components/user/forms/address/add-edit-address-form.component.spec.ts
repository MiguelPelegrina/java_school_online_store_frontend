import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditAddressForm } from './add-edit-address-form.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormGroupDirective } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

describe('AddressSelectorComponent', () => {
  let component: AddEditAddressForm;
  let fixture: ComponentFixture<AddEditAddressForm>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddEditAddressForm],
      imports:[HttpClientTestingModule,MatCardModule, MatIconModule, MatFormFieldModule, MatSelectModule],
      // providers:[{
      //   provide: FormGroupDirective,
      //   useValue: {
      //     load: jasmine.createSpy('load').and.returnValue(new Promise(() => true))
      //   }
      // }]
    });
    fixture = TestBed.createComponent(AddEditAddressForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
