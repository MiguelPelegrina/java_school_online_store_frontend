import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CatalogComponent } from './catalog.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgxPermissionsModule, NgxPermissionsService } from 'ngx-permissions';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FiltersComponent } from './filters/filters.component';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { BooksHeaderComponent } from './books-header/books-header.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

describe('CatalogComponent', () => {
  let component: CatalogComponent;
  let fixture: ComponentFixture<CatalogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        BooksHeaderComponent,
        CatalogComponent, 
        FiltersComponent, 
        SearchBarComponent
      ],
      imports:[
        BrowserAnimationsModule,
        FormsModule,
        HttpClientTestingModule,
        MatCardModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatGridListModule,
        MatListModule,
        MatMenuModule,
        MatPaginatorModule,
        MatSidenavModule,
        MatSnackBarModule, 
        MatProgressSpinnerModule,
        NgxPermissionsModule.forRoot()
      ],
      providers:[NgxPermissionsService]
    });
    fixture = TestBed.createComponent(CatalogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
