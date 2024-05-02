import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOrderComponent } from './list-order.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgxPermissionsModule, NgxPermissionsService } from 'ngx-permissions';
import { SearchBarComponent } from '../../search-bar/search-bar.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';

describe('ListOrderComponent', () => {
  let component: ListOrderComponent;
  let fixture: ComponentFixture<ListOrderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ListOrderComponent, 
        SearchBarComponent
      ],
      imports:[
        HttpClientTestingModule,
        MatFormFieldModule, 
        MatIconModule,
        MatPaginatorModule, 
        MatSnackBarModule, 
        MatProgressSpinnerModule,
        MatTableModule,
        NgxPermissionsModule.forRoot()
      ],
      providers:[NgxPermissionsService]
    });
    fixture = TestBed.createComponent(ListOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
