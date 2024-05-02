import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditUserFormComponent } from './add-edit-user-form.component';
import { FormGroupDirective } from '@angular/forms';

describe('AddEditUserForm', () => {
  let component: AddEditUserFormComponent;
  let fixture: ComponentFixture<AddEditUserFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddEditUserFormComponent],
      //imports: [FormGroupDirective]
    });
    fixture = TestBed.createComponent(AddEditUserFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
