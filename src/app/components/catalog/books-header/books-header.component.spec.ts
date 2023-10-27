import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BooksHeaderComponent } from './books-header.component';

describe('BooksHeaderComponent', () => {
  let component: BooksHeaderComponent;
  let fixture: ComponentFixture<BooksHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BooksHeaderComponent]
    });
    fixture = TestBed.createComponent(BooksHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
