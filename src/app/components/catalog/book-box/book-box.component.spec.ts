import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookBoxComponent } from './book-box.component';

describe('BookBoxComponent', () => {
  let component: BookBoxComponent;
  let fixture: ComponentFixture<BookBoxComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BookBoxComponent]
    });
    fixture = TestBed.createComponent(BookBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
