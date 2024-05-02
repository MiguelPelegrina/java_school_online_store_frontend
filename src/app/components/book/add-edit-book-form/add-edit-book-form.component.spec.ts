import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { AddEditBookFormComponent } from './add-edit-book-form.component';
import { SearchBarComponent } from '../../search-bar/search-bar.component';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('AddEditBookFormComponent', () => {
  let component: AddEditBookFormComponent;
  let fixture: ComponentFixture<AddEditBookFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AddEditBookFormComponent, 
        SearchBarComponent
      ],
      imports:[
        BrowserAnimationsModule,
        HttpClientTestingModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatSlideToggleModule,
        ReactiveFormsModule,
        RouterTestingModule
      ],
    });
    fixture = TestBed.createComponent(AddEditBookFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
