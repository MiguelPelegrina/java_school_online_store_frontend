import { Component, OnDestroy, OnInit } from '@angular/core';
import { Book } from 'src/app/shared/domain/book/book';
import { BookService } from 'src/app/services/book/book.service';
import { CartService } from 'src/app/services/cart/cart.service';
import { Subscription } from 'rxjs';

const ROWS_HEIGHT: { [id: number]: number} = { 1: 400, 3: 335, 4: 350 };

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit, OnDestroy {
  // Fields
  protected bookList: Book[] = [];

  protected bookSubscription?: Subscription ;

  protected cols = 3;

  protected count = '12';

  protected filter = '';

  protected genre?: string;

  protected rowHeight = ROWS_HEIGHT[this.cols];

  protected sort = 'desc';

  /**
   * Constructor
   * @param bookService - Book service
   */
  constructor(private bookService: BookService, private cartService: CartService){}

  /**
   * A lifecycle hook that is called when a directive, pipe, or service is destroyed. Used for any custom cleanup that needs to occur when the instance is destroyed.
   */
  public ngOnDestroy(): void {
    this.bookSubscription?.unsubscribe();
  }

  public ngOnInit(): void {
    this.getBooks();
  }

  /**
   * Filters the data of the table with the value of the input of the search bar.
   * @param filter - Value of the input field
   */
  protected applyFilter(filter: string){
    this.filter = filter;
    this.getBooks();
  }

  protected onAddToCart(book: Book): void {
    this.cartService.addToCart({...book, quantity: 1});
  }

  protected onColumnsCountChange(colsNumber: number): void{
    this.cols = colsNumber;
    this.rowHeight = ROWS_HEIGHT[this.cols];
  }

  protected onItemsCountChange(newCount: number): void{
    this.count = newCount.toString();
    this.getBooks();
  }

  protected onShowGenre(genre: string): void{
    this.genre = genre;
  }

  protected onSortChange(newSort: string) {
    this.sort = newSort;
    this.getBooks();
  }

  // TODO Add parameters
  private getBooks(): void{
    this.bookSubscription = this.bookService.getAll(true, this.filter).subscribe({
      next: (bookList: Book[]) => {
        this.bookList = bookList;
      }
    });
  }
}
