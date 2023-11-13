import { AfterContentInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { CartService } from 'src/app/services/cart/cart.service';
import { Book } from 'src/app/shared/domain/book/book';

@Component({
  selector: 'app-book-box',
  templateUrl: './book-box.component.html',
  styleUrls: ['./book-box.component.css']
})
export class BookBoxComponent implements AfterContentInit {
  // Fields
  @Input()
  public fullWidthMode = false;

  @Input()
  public book!: Book;

  protected enoughStock?: boolean = false;

  @Output()
  private addToCart = new EventEmitter();

  constructor(private cartService: CartService){}

  public ngAfterContentInit(): void {
    const boughtBook = this.cartService.getBooks().find(book => {
      return this.book.id === book.id;
    })

    if (boughtBook) {
      this.enoughStock = this.book?.stock - boughtBook.quantity > 0;
    } else {
      this.enoughStock = this.book?.stock > 0;
    }
  }

  public onAddToCart(): void{
    this.addToCart.emit(this.book);
    this.enoughStock = this.cartService.enoughStock(this.book);
  }
}
