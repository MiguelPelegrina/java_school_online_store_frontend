import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListBookGenreComponent } from './list-book-genre.component';

describe('ListBookGenreComponent', () => {
  let component: ListBookGenreComponent;
  let fixture: ComponentFixture<ListBookGenreComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListBookGenreComponent]
    });
    fixture = TestBed.createComponent(ListBookGenreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
