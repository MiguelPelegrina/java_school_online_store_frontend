import { Component, Input, OnInit } from '@angular/core';
import { NgxPermissionsService } from 'ngx-permissions';
import { CartService } from 'src/app/services/cart/cart.service';
import { BoughtBook } from 'src/app/shared/domain/book/bought-book/bought-book';
import { Cart } from 'src/app/shared/domain/cart/cart';
import { getRoles } from 'src/app/shared/utils/utils';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{
  // Fields
  @Input()
  pageTitle: string = '';

  protected booksQuantity = 0;

  private _cart: Cart = { boughtBooks: [] };

  constructor(private cartService: CartService, private permissionsService: NgxPermissionsService){}

  // Methods
  @Input()
  get cart(): Cart {
    return this._cart;
  }

  set cart(cart: Cart){
    this._cart = cart;

    this.booksQuantity = cart.boughtBooks.map((book)=> book.quantity)
    .reduce((prev, current) => prev + current, 0);
  }

  // Public methods
  public ngOnInit(): void {
    this.permissionsService.loadPermissions(getRoles());
    this.cartService.cartSubject.subscribe((_cart) => {
      this.cart = _cart;
    })
  }

  // Protected methods
  protected getTotal(boughtBooks: BoughtBook[]): number{
    return this.cartService.getTotal(boughtBooks);
  }

  protected onClearCart(){
    this.cartService.clearCart();
  }

  protected onLogout(){
    localStorage.clear();
    this.permissionsService.flushPermissions();
  }
}
