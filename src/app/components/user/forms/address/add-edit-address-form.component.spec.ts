import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddEditAddressFormComponent } from './add-edit-address-form.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder, FormGroupDirective } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

describe('AddressSelectorComponent', () => {
  let component: AddEditAddressFormComponent;
  let fixture: ComponentFixture<AddEditAddressFormComponent>;

  beforeEach(waitForAsync(() => {
    const fb = new FormBuilder();
    
    const mockFormGroupDirective: FormGroupDirective = new FormGroupDirective([],[])
    mockFormGroupDirective.form = fb.group({
      country: fb.control('Spain'),
    })

    TestBed.configureTestingModule({
      declarations: [AddEditAddressFormComponent],
      imports:[HttpClientTestingModule,MatCardModule, MatIconModule, MatFormFieldModule, MatSelectModule],
      providers: [
        FormGroupDirective,
        FormBuilder,
        {provide: FormGroupDirective, useValue: mockFormGroupDirective}
      ],
    }).compileComponents();
  }));

  beforeEach(()=> {
    fixture = TestBed.createComponent(AddEditAddressFormComponent);
    component = fixture.componentInstance;
    component.formGroupName = 'address';

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
