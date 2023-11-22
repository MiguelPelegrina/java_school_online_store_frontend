import { Component, Input, OnInit } from '@angular/core';
import { NgxPermissionsService } from 'ngx-permissions';
import { CartService } from 'src/app/services/cart/cart.service';
import { BoughtBook } from 'src/app/shared/domain/book/bought-book/bought-book';
import { Cart } from 'src/app/shared/domain/cart/cart';
import { AuthUtils } from 'src/app/shared/utils/auth-utils';

/**
 * Header component of the page.
 */
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

  protected hasRoles = false;

  private _cart: Cart;

  /**
   * Constructor
   * @param cartService - Service for managing the shopping cart
   * @param permissionsService - Service for managing user permissions
   */
  constructor(private cartService: CartService, private permissionsService: NgxPermissionsService){
    this._cart = { boughtBooks: [] }
  }

  // Methods
  // Public methods
  // Getter and setter for cart
  @Input()
  get cart(): Cart {
    return this._cart;
  }

  set cart(cart: Cart){
    this._cart = cart;

    this.booksQuantity = cart.boughtBooks.map((book)=> book.quantity)
      .reduce((prev, current) => prev + current, 0);
  }

  // Lifecycle hooks
  /**
   * A lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   * Loads the permission of the user, if logged in.
   */
  public ngOnInit(): void {
    this.permissionsService.loadPermissions(AuthUtils.getRoles());

    this.cartService.cartSubject.subscribe((_cart) => {
      this.cart = _cart;
    })
  }

  // Protected methods
  /**
   * Calculate the total cost of the bought books in the cart
   * @param boughtBooks - List of bought books
   * @returns Total cost of the books
   */
  protected getTotal(boughtBooks: BoughtBook[]): number{
    return this.cartService.getTotal(boughtBooks);
  }

  /**
   * Clear the items from the cart
   */
  protected onClearCart(): void{
    this.cartService.clearCart();
  }

  /**
   * Logout the user by clearing local storage and flushing permissions
   */
  protected onLogout(): void{
    localStorage.clear();
    this.permissionsService.flushPermissions();
  }
}
