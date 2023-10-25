import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ListCountryComponent } from './components/country/list-country/list-country.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing-module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddCountryComponent } from './components/country/add-country/add-country.component';
import { RouterModule } from '@angular/router';
import { UpdateCountryComponent } from './components/country/update-country/update-country.component';
import { DetailCountryComponent } from './components/country/detail-country/detail-country.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatPaginatorModule} from '@angular/material/paginator';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ListBookComponent } from './components/book/list-book/list-book.component';
import { ViewBookComponent } from './components/book/view-book/view-book.component';
import { MatButtonModule } from '@angular/material/button';
import { ImageSelectorComponent } from './shared/components/image-selector/image-selector.component';
import { AddEditBookFormComponent } from './components/book/add-edit-book-form/add-edit-book-form.component';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ListBookGenreComponent } from './components/book-genres/list-book-genre/list-book-genre.component';
import { ListBookParametersFormatComponent } from './components/book-parameters-formats/list-book-parameters-format/list-book-parameters-format.component';
import { BookCardComponent } from './components/catalog/book-card/book-card.component';
import { CatalogComponent } from './components/catalog/catalog.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { SearchBarComponent } from './shared/components/search-bar/search-bar.component'
import { MatCardModule } from '@angular/material/card';
import { ShoopingCartComponent } from './components/shopping-cart/shopping-cart.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthInterceptor } from './components/auth/auth-interceptor';

@NgModule({
  declarations: [
    AddCountryComponent,
    AddEditBookFormComponent,
    AppComponent,
    BookCardComponent,
    CatalogComponent,
    DetailCountryComponent,
    ImageSelectorComponent,
    ListBookComponent,
    ListBookGenreComponent,
    ListBookParametersFormatComponent,
    ListCountryComponent,
    SearchBarComponent,
    UpdateCountryComponent,
    ViewBookComponent,
    ShoopingCartComponent,
    LoginComponent,
    RegisterComponent,
  ],
  // TODO Only import here when the module is being used in more then one component?
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTooltipModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  providers: [
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 5000} },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
