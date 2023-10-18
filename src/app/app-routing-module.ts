import { RouterModule, Routes } from "@angular/router";
import { ListCountryComponent } from "./components/country/list-country/list-country.component";
import { NgModule } from "@angular/core";
import { AddCountryComponent } from "./components/country/add-country/add-country.component";
import { UpdateCountryComponent } from "./components/country/update-country/update-country.component";
import { DetailCountryComponent } from "./components/country/detail-country/detail-country.component";
import { ListBookComponent } from "./components/book/list-book/list-book.component";
import { ViewBookComponent } from "./components/book/view-book/view-book.component";
import { AddEditBookFormComponent } from "./components/book/add-edit-book-form/add-edit-book-form.component";

const routes: Routes = [
  // TODO Home page
  {path: '', redirectTo:'books', pathMatch:'full'},
  {path: 'books', component: ListBookComponent},
  {path: 'books/add', component: AddEditBookFormComponent},
  {path: 'books/view/:id', component: ViewBookComponent},
  {path: 'books/edit/:id', component: AddEditBookFormComponent},
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
