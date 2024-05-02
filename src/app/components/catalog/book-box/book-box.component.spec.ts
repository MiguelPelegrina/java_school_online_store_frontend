import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookBoxComponent } from './book-box.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';

describe('BookBoxComponent', () => {
  let component: BookBoxComponent;
  let fixture: ComponentFixture<BookBoxComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BookBoxComponent],
      imports:[MatSnackBarModule],
    });
    fixture = TestBed.createComponent(BookBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
