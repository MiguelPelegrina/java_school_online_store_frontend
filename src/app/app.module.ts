import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ListCountryComponent } from './components/country/list-country/list-country.component';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing-module';
import { FormsModule } from '@angular/forms';
import { AddCountryComponent } from './components/country/add-country/add-country.component';
import { RouterModule } from '@angular/router';
import { UpdateCountryComponent } from './components/country/update-country/update-country.component';
import { DetailCountryComponent } from './components/country/detail-country/detail-country.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { ListBookComponent } from './components/book/list-book/list-book.component';
import { AddBookComponent } from './components/book/add-book/add-book.component';

@NgModule({
  declarations: [
    AppComponent,
    AddBookComponent,
    AddCountryComponent,
    DetailCountryComponent,
    ListBookComponent,
    ListCountryComponent,
    UpdateCountryComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    MatIconModule,
    MatSlideToggleModule,
    RouterModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
