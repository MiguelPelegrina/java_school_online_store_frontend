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
import { SalesStatisticsComponent } from "./components/sales-statistics/sales-statistics.component";
import { ngxPermissionsGuard } from "ngx-permissions";

const generateRoute = (path: string, component: any, canActivate: any[] = [], permissions: string[] = []) => ({
  path,
  component,
  canActivate: canActivate.length ? [...canActivate] : undefined,
  data: {
    permissions: {
      only: permissions.length ? permissions : ['ADMIN', 'EMPLOYEE'],
      redirectTo: '/catalog'
    }
  }
});

const routes: Routes = [
  { path: '', redirectTo: 'catalog', pathMatch: 'full' },
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/register', component: ProfileComponent },
  generateRoute('book_formats', ListBookParametersFormatComponent, [ngxPermissionsGuard]),
  generateRoute('book_genres', ListBookGenreComponent, [ngxPermissionsGuard]),
  generateRoute('books', ListBookComponent, [ngxPermissionsGuard]),
  generateRoute('books/add', AddEditBookFormComponent, [ngxPermissionsGuard]),
  generateRoute('books/edit/:id', AddEditBookFormComponent, [ngxPermissionsGuard]),
  { path: 'books/view/:id', component: ViewBookComponent },
  { path: 'cart', component: CartComponent },
  { path: 'catalog', component: CatalogComponent },
  generateRoute('orders', ListOrderComponent, [ngxPermissionsGuard], ['ADMIN', 'EMPLOYEE', 'CLIENT']),
  { path: 'profile', component: ProfileComponent },
  generateRoute('sales_statistics', SalesStatisticsComponent, [ngxPermissionsGuard]),
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule{}
