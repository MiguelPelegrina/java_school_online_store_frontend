import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListBookGenreComponent } from './list-book-genre.component';
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

describe('ListBookGenreComponent', () => {
  let component: ListBookGenreComponent;
  let fixture: ComponentFixture<ListBookGenreComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ListBookGenreComponent, 
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
    fixture = TestBed.createComponent(ListBookGenreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
