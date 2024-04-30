import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookExcelParserComponent } from './book-excel-parser.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('BookExcelParserComponent', () => {
  let component: BookExcelParserComponent;
  let fixture: ComponentFixture<BookExcelParserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BookExcelParserComponent],
      imports:[BrowserAnimationsModule,HttpClientTestingModule, MatPaginatorModule],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(BookExcelParserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
