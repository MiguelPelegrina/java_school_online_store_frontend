import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListCustomerComponent } from './list-customer.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SearchBarComponent } from '../../search-bar/search-bar.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ListCustomerComponent', () => {
  let component: ListCustomerComponent;
  let fixture: ComponentFixture<ListCustomerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ListCustomerComponent,
        SearchBarComponent
      ],
      imports:[
        BrowserAnimationsModule,
        FormsModule,
        HttpClientTestingModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        MatTableModule
      ]
    });
    fixture = TestBed.createComponent(ListCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
