import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditAddressForm } from './add-edit-address-form.component';

describe('AddressSelectorComponent', () => {
  let component: AddEditAddressForm;
  let fixture: ComponentFixture<AddEditAddressForm>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddEditAddressForm]
    });
    fixture = TestBed.createComponent(AddEditAddressForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
