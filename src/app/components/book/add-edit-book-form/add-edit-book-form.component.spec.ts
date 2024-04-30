import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { AddEditBookFormComponent } from './add-edit-book-form.component';

describe('SaveFormComponent', () => {
  let component: AddEditBookFormComponent;
  let fixture: ComponentFixture<AddEditBookFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddEditBookFormComponent],
      imports:[HttpClientTestingModule]
    });
    fixture = TestBed.createComponent(AddEditBookFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
