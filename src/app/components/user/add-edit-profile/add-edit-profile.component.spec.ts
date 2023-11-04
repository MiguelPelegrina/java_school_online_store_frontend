import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditProfileComponent } from './add-edit-profile.component';

describe('AddEditProfileComponent', () => {
  let component: AddEditProfileComponent;
  let fixture: ComponentFixture<AddEditProfileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddEditProfileComponent]
    });
    fixture = TestBed.createComponent(AddEditProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
