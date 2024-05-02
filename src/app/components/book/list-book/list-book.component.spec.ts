import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListBookComponent } from './list-book.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { SearchBarComponent } from '../../search-bar/search-bar.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterTestingModule } from '@angular/router/testing';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ListBookComponent', () => {
  let component: ListBookComponent;
  let fixture: ComponentFixture<ListBookComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListBookComponent,SearchBarComponent],
      imports:[
        BrowserAnimationsModule,
        FormsModule,
        HttpClientTestingModule, 
        MatFormFieldModule, 
        MatIconModule, 
        MatInputModule,
        MatPaginatorModule, 
        MatSnackBarModule,
        MatProgressSpinnerModule,
        MatTableModule,
        RouterTestingModule
      ]
    });
    fixture = TestBed.createComponent(ListBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
