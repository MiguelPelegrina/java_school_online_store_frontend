import { AfterContentInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { CartService } from 'src/app/services/cart/cart.service';
import { Book } from 'src/app/shared/domain/book/book';

/**
 * Angular component representing a box displaying information about a book.
 * This component provides options to add the book to the cart and displays the stock availability.
 */
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

   /**
   * Constructor of the component.
   * @param cartService - Service for managing the shopping cart
   */
  constructor(private cartService: CartService){}

  /**
   * A lifecycle hook that is called after Angular has fully initialized all content of a directive. It will run only once when the projected content is initialized.
   * Checks the stock availability of the book and sets the `enoughStock` property accordingly.
   */
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

  /**
   * Event handler for the "Add to Cart" button click.
   * Emits the book through the `addToCart` event and updates the stock availability.
   */
  public onAddToCart(): void{
    this.addToCart.emit(this.book);
    this.enoughStock = this.cartService.enoughStock(this.book);
  }
}
