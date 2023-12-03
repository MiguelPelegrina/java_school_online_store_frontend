import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookExcelParserComponent } from './book-excel-parser.component';

describe('BookExcelParserComponent', () => {
  let component: BookExcelParserComponent;
  let fixture: ComponentFixture<BookExcelParserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BookExcelParserComponent]
    });
    fixture = TestBed.createComponent(BookExcelParserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
