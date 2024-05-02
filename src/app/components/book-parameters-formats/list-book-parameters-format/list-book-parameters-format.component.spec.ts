import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListBookParametersFormatComponent } from './list-book-parameters-format.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatIconModule } from '@angular/material/icon';
import { SearchBarComponent } from '../../search-bar/search-bar.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ListBookParametersFormatComponent', () => {
  let component: ListBookParametersFormatComponent;
  let fixture: ComponentFixture<ListBookParametersFormatComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ListBookParametersFormatComponent, 
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
        MatProgressBarModule,
        MatTableModule
      ]
    });
    fixture = TestBed.createComponent(ListBookParametersFormatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
