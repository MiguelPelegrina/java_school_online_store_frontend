import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing-module';
import { AppComponent } from './app.component';
import { AuthInterceptor } from './services/auth/auth-interceptor';
import { ListBookGenreComponent } from './components/book-genres/list-book-genre/list-book-genre.component';
import { ListBookParametersFormatComponent } from './components/book-parameters-formats/list-book-parameters-format/list-book-parameters-format.component';
import { AddEditBookFormComponent } from './components/book/add-edit-book-form/add-edit-book-form.component';
import { ListBookComponent } from './components/book/list-book/list-book.component';
import { BooksHeaderComponent } from './components/catalog/books-header/books-header.component';
import { CatalogComponent } from './components/catalog/catalog.component';
import { HeaderComponent } from './components/header/header.component';
import { LoginComponent } from './components/user/login/login.component';
import { ImageSelectorComponent } from './shared/components/image-selector/image-selector.component';
import { SearchBarComponent } from './shared/components/search-bar/search-bar.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { FiltersComponent } from './components/catalog/filters/filters.component';
import { BookBoxComponent } from './components/catalog/book-box/book-box.component';
import { CartComponent } from './components/cart/cart.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { TwoDigitDecimalNumberDirective } from './shared/utils/directives/twoDigitDecimalNumber'
import { MatSelectModule } from '@angular/material/select';
import { ProfileComponent } from './components/user/profile/profile.component';
import { AddEditAddressForm } from './components/user/forms/address/add-edit-address-form.component';
import { AddEditUserForm } from './components/user/forms/user/add-edit-user-form.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask} from 'ngx-mask';
import { MatStepperModule } from '@angular/material/stepper';
import { OrderDetailsFormComponent } from './components/cart/order-details-form/order-details-form.component';
import { ListOrderComponent } from './components/order/list-order/list-order.component';
import { DatePipe } from '@angular/common';

@NgModule({
  declarations: [
    AddEditBookFormComponent,
    AppComponent,
    BookBoxComponent,
    BooksHeaderComponent,
    CartComponent,
    CatalogComponent,
    FiltersComponent,
    HeaderComponent,
    ImageSelectorComponent,
    ListBookComponent,
    ListBookGenreComponent,
    ListBookParametersFormatComponent,
    LoginComponent,
    SearchBarComponent,
    TwoDigitDecimalNumberDirective,
    AddEditAddressForm,
    ProfileComponent,
    AddEditUserForm,
    OrderDetailsFormComponent,
    ListOrderComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    DatePipe,
    FormsModule,
    HttpClientModule,
    MatBadgeModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatOptionModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatNativeDateModule,
    MatSelectModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatStepperModule,
    MatSortModule,
    MatTableModule,
    MatToolbarModule,
    MatTooltipModule,
    NgxMaskDirective,
    NgxMaskPipe,
    ReactiveFormsModule,
    RouterModule,
  ],
  providers: [
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 5000} },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    provideNgxMask()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
