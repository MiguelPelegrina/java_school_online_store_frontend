import { AfterContentInit, AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
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

  protected enoughStock?: boolean = true;

  @Output()
  private addToCart = new EventEmitter();

  constructor(private cartService: CartService){}

  public ngAfterContentInit(): void {
    if(this.book?.stock <= 0){
      this.enoughStock = false;
    }
  }

  public onAddToCart(): void{
    const cart = this.cartService.getBooks();

    const bookInCart = cart.find((book) => {
      if(book.id === this.book?.id){
        return book;
      } else {
        return null;
      }
    })

    // TODO Seems iffy
    if(bookInCart && (bookInCart.quantity + 2) > this.book!.stock){
      this.enoughStock = false;
    }

    this.addToCart.emit(this.book);
  }
}
