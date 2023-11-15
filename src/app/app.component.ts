import { Component, OnInit } from '@angular/core';
import { Cart } from './shared/domain/cart/cart';
import { CartService } from './services/cart/cart.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  // Fields
  public cart: Cart = {boughtBooks: []};

  public title = 'Online Bookstore';

  /**
   * Default constructor
   * @param cartService
   */
  constructor(private cartService: CartService) {}

  // Metods
  // Public methods
  public ngOnInit(): void {
    this.cartService.loadCart();
  }
}
