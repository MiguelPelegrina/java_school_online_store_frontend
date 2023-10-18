import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditBookFormComponent } from './add-edit-book-form.component';

describe('SaveFormComponent', () => {
  let component: AddEditBookFormComponent;
  let fixture: ComponentFixture<AddEditBookFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddEditBookFormComponent]
    });
    fixture = TestBed.createComponent(AddEditBookFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
