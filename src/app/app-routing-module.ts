
import { ListCountryComponent } from "./components/country/list-country/list-country.component";
import { NgModule } from "@angular/core";
import { AddCountryComponent } from "./components/country/add-country/add-country.component";
import { UpdateCountryComponent } from "./components/country/update-country/update-country.component";
import { DetailCountryComponent } from "./components/country/detail-country/detail-country.component";
import { ListBookComponent } from "./components/book/list-book/list-book.component";
import { ViewBookComponent } from "./components/book/view-book/view-book.component";
import { AddEditBookFormComponent } from "./components/book/add-edit-book-form/add-edit-book-form.component";
import { ListBookGenreComponent } from "./components/book-genres/list-book-genre/list-book-genre.component";
import { CatalogComponent } from "./components/catalog/catalog.component";
import { LoginComponent } from "./components/login/login.component";
import { RegisterComponent } from "./components/register/register.component";
import { ListBookParametersFormatComponent } from "./components/book-parameters-formats/list-book-parameters-format/list-book-parameters-format.component";
import { RouterModule, Routes } from "@angular/router";
import { CartComponent } from "./components/cart/cart.component";

const routes: Routes = [
  {path: '', redirectTo:'catalog', pathMatch:'full'},
  {path: 'auth/login', component: LoginComponent},
  {path: 'auth/register', component: RegisterComponent},
  {path: 'book_formats', component: ListBookParametersFormatComponent},
  {path: 'book_genres', component: ListBookGenreComponent},
  {path: 'books', component: ListBookComponent},
  {path: 'books/add', component: AddEditBookFormComponent},
  {path: 'books/view/:id', component: ViewBookComponent},
  {path: 'books/edit/:id', component: AddEditBookFormComponent},
  {path: 'cart', component: CartComponent},
  {path: 'catalog', component: CatalogComponent},
  {path: 'countries', component: ListCountryComponent},
  {path: 'countries/add', component: AddCountryComponent},
  {path: 'countries/details/:name', component: DetailCountryComponent},
  {path: 'countries/update/:name', component: UpdateCountryComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule{}
