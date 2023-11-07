import { NgModule } from "@angular/core";
import { ListBookComponent } from "./components/book/list-book/list-book.component";
import { AddEditBookFormComponent } from "./components/book/add-edit-book-form/add-edit-book-form.component";
import { ListBookGenreComponent } from "./components/book-genres/list-book-genre/list-book-genre.component";
import { CatalogComponent } from "./components/catalog/catalog.component";
import { LoginComponent } from "./components/user/login/login.component";
import { ListBookParametersFormatComponent } from "./components/book-parameters-formats/list-book-parameters-format/list-book-parameters-format.component";
import { RouterModule, Routes } from "@angular/router";
import { CartComponent } from "./components/cart/cart.component";
import { ProfileComponent } from "./components/user/profile/profile.component";
import { ListOrderComponent } from "./components/order/list-order/list-order.component";
import { ViewBookComponent } from "./components/book/view-book/view-book.component";

const routes: Routes = [
  {path: '', redirectTo:'catalog', pathMatch:'full'},
  {path: 'auth/login', component: LoginComponent},
  {path: 'auth/register', component: ProfileComponent},
  {path: 'book_formats', component: ListBookParametersFormatComponent},
  {path: 'book_genres', component: ListBookGenreComponent},
  {path: 'books', component: ListBookComponent},
  {path: 'books/add', component: AddEditBookFormComponent},
  {path: 'books/edit/:id', component: AddEditBookFormComponent},
  {path: 'books/view/:id', component: ViewBookComponent},
  {path: 'cart', component: CartComponent},
  {path: 'catalog', component: CatalogComponent},
  {path: 'orders', component: ListOrderComponent},
  {path: 'profile', component: ProfileComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule{}
