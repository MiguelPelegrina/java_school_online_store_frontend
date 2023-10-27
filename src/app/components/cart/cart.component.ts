import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart/cart.service';
import { BoughtBook } from 'src/app/shared/domain/book/bought-book/bought-book';
import { Cart } from 'src/app/shared/domain/cart/cart';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit{
  // Fields
  protected cart: Cart = { boughtBooks: []};

  protected dataSource: BoughtBook[] = [];

  protected displayedColumns: string[] = [
    'book',
    'title',
    'price',
    'quantity',
    'total',
    'actions'
  ];

  constructor(private cartService: CartService){}

  // Methods
  // Public methods
  public ngOnInit(): void {
    this.cartService.cartSubject.subscribe((_cart: Cart) => {
      this.cart = _cart;
      this.dataSource = this.cart.boughtBooks;
    })

    /*this.cartService.loadCart();
    this.dataSource = this.cartService.getBooks();*/
  }

  // Protected methods
  protected getTotal(boughtBooks: BoughtBook[]): number{
    return this.cartService.getTotal(boughtBooks);
  }

  protected onClearCart(): void {
    // TODO Ask user for confirmation
    this.cartService.clearCart();
  }

  protected onAddQuantity(boughtBook: BoughtBook){
    this.cartService.addToCart(boughtBook);
  }

  protected onRemoveFromCart(bookBought: BoughtBook): void {
    this.cartService.removeFromCart(bookBought);
  }

  protected onRemoveQuantity(boughtBook: BoughtBook): void{
    this.cartService.removeQuantity(boughtBook);
  }
}
