import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BooksHeaderComponent } from './books-header.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

describe('BooksHeaderComponent', () => {
  let component: BooksHeaderComponent;
  let fixture: ComponentFixture<BooksHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BooksHeaderComponent],
      imports:[HttpClientTestingModule, MatCardModule, MatIconModule, MatMenuModule]
    });
    fixture = TestBed.createComponent(BooksHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
