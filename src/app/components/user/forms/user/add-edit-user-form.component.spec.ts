import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditUserForm } from './add-edit-user-form.component';

describe('AddEditUserForm', () => {
  let component: AddEditUserForm;
  let fixture: ComponentFixture<AddEditUserForm>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddEditUserForm]
    });
    fixture = TestBed.createComponent(AddEditUserForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
