import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ListCountryComponent } from './components/country/list-country/list-country.component';
import { HttpClientModule } from '@angular/common/http';
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
import { AddBookComponent } from './components/book/add-book/add-book.component';
import { ViewBookComponent } from './components/book/view-book/view-book.component';
import { EditBookComponent } from './components/book/edit-book/edit-book.component';
import { MatButtonModule } from '@angular/material/button';
import { ImageSelectorComponent } from './shared/components/image-selector/image-selector.component';
import { AddEditBookFormComponent } from './components/book/add-edit-book-form/add-edit-book-form.component';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [
    AppComponent,
    AddBookComponent,
    AddCountryComponent,
    AddEditBookFormComponent,
    DetailCountryComponent,
    EditBookComponent,
    ImageSelectorComponent,
    ListBookComponent,
    ListCountryComponent,
    UpdateCountryComponent,
    ViewBookComponent,
  ],
  // TODO Only import here when the module is being used in more then one component?
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    MatButtonModule,
    MatFormFieldModule,
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
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 5000}}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
