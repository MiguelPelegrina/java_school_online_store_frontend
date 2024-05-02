import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopProductsComponent } from './top-products.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';

describe('TopProductsComponent', () => {
  let component: TopProductsComponent;
  let fixture: ComponentFixture<TopProductsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TopProductsComponent],
      imports:[
        HttpClientTestingModule,
        MatProgressSpinnerModule,
        MatTableModule
      ],
    });
    fixture = TestBed.createComponent(TopProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
