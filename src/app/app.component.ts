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
  title = 'Online Bookstore';
  cart: Cart = {boughtBooks: []}

  constructor(private cartService: CartService) {}

  // Metods
  // Public methods
  ngOnInit(): void {
    this.cartService.loadCart();
  }
}
