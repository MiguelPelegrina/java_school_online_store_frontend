import { LocalizedString } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs';
import { BoughtBook } from 'src/app/shared/domain/book/bought-book/bought-book';
import { Cart } from 'src/app/shared/domain/cart/cart';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  // Fields
  // TODO Not sure if redundant
  cartSubject = new BehaviorSubject<Cart>({boughtBooks: []});

  cart: BoughtBook[] = [];

  // Constructor
  constructor(private snackbar: MatSnackBar){}

  // Methods
  // Public methods
  public addToCart(newItem: BoughtBook): void {
    if (localStorage.getItem('cart_items')) {
      this.cart = JSON.parse(localStorage.getItem('cart_items')!);
    } else {
      this.cart = [];
    }

    const itemInCart = this.cart.find(item => item.id === newItem.id);

    if (itemInCart) {
      itemInCart.quantity++;
    } else {
      this.cart.push(newItem);
    }

    this.saveCart();

    this.snackbar.open(`${newItem.title} added to cart`, 'Ok', { duration: 3000});
  }

  // Public methods
  public clearCart() {
    this.cartSubject.next({boughtBooks: []});

    this.cart = [];

    localStorage.removeItem("cart_items");

    this.snackbar.open('Cart is cleared', 'Ok', { duration: 3000 })
  }

  public getBooks() {
    return this.cart;
  }

  public getTotal(boughtBooks: BoughtBook[]): number{
    return boughtBooks.map(
        (boughtBook) => boughtBook.price * boughtBook.quantity)
      .reduce(
        (prev, current) => prev + current, 0
      );
  }

  public loadCart(): void {
    if (localStorage.getItem('cart_items')){
      this.cart = JSON.parse(localStorage.getItem("cart_items")!);
    } else {
      this.cart = [];
    }

    this.saveCart();
  }

  public removeFromCart(boughtBook: BoughtBook, update = true): BoughtBook[] {
    this.cart = this.cart.filter(
      (book) => book.id !== boughtBook.id
    );

    if(update){
      //this.cart.next({ boughtBooks: filteredBooks});
      this.snackbar.open(`${boughtBook.title} removed from cart`, 'Ok', {duration: 3000})
    }

    this.saveCart();

    return this.cart;
  }


  public removeQuantity(updatedBook: BoughtBook): void {
    let bookForRemoval: BoughtBook | undefined;

    this.cart = this.cart.map((book) => {
      if(book.id === updatedBook.id){
        book.quantity--;

        if(book.quantity === 0){
          bookForRemoval = book;
        }
      }

      return book;
    })

    if(bookForRemoval){
      this.cart = this.removeFromCart(bookForRemoval, false);
    }

    this.saveCart();

    this.snackbar.open('1 item removed from cart', 'Ok', {duration: 3000});
  }

  // Private methods
  private saveCart(): void {
    this.cartSubject.next({boughtBooks: this.cart});

    localStorage.setItem('cart_items', JSON.stringify(this.cart));
  }
}
