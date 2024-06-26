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
import { ngxPermissionsGuard } from "ngx-permissions";
import { TopProductsComponent } from "./components/sales-statistics/top-products/top-products.component";
import { ListCustomerComponent } from "./components/sales-statistics/list-customer/list-customer.component";
import { RevenueCalculatorComponent } from "./components/sales-statistics/revenue-calculator/revenue-calculator.component";
import { BookExcelParserComponent } from "./components/book/book-excel-parser/book-excel-parser.component";

/**
 * Generates a route configuration object with optional permissions.
 * @param path - The route path.
 * @param component - The component associated with the route.
 * @param permissions - An array of user permissions required for the route. Default is ['ADMIN', 'EMPLOYEE'].
 * @returns A route configuration object.
 */
const generateRoute = (path: string, component: any, permissions: string[] = []) => ({
  path,
  component,
  canActivate: [ngxPermissionsGuard],

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
  { path: 'books/view/:id', component: ViewBookComponent },
  { path: 'cart', component: CartComponent },
  { path: 'catalog', component: CatalogComponent },
  { path: 'profile', component: ProfileComponent },
  generateRoute('import-excel', BookExcelParserComponent),
  generateRoute('book_formats', ListBookParametersFormatComponent),
  generateRoute('orders', ListOrderComponent, ['ADMIN', 'EMPLOYEE', 'CLIENT']),
  generateRoute('book_genres', ListBookGenreComponent),
  generateRoute('books', ListBookComponent),
  generateRoute('books/add', AddEditBookFormComponent),
  generateRoute('books/edit/:id', AddEditBookFormComponent),
  generateRoute('top_products', TopProductsComponent),
  generateRoute('clients', ListCustomerComponent),
  generateRoute('revenues', RevenueCalculatorComponent)
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule{}
