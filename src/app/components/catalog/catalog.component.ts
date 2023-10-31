import { Component, OnDestroy, OnInit } from '@angular/core';
import { Book } from 'src/app/shared/domain/book/book';
import { BookService } from 'src/app/services/book/book.service';
import { CartService } from 'src/app/services/cart/cart.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';

const ROWS_HEIGHT: { [id: number]: number} = { 1: 400, 3: 335, 4: 350 };

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit, OnDestroy {
  // Fields
  protected bookList: Book[] = [];

  protected bookSubscription?: Subscription;

  protected cols = 3;

  protected currentPage = 0;

  protected filter = '';

  protected genre?: string;

  protected isLoading: boolean = true;

  protected pageEvent?: PageEvent;

  protected pageSize = 12;

  protected pageSizeOptions: number[] = [3, 6, 9, 12, 24, 36];

  protected rowHeight = ROWS_HEIGHT[this.cols];

  protected sort = 'asc';

  protected totalElements: number = 0;

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

  protected onPageChange(event: PageEvent): void {
    this.pageEvent = event;
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getBooks();
  }

  protected onShowGenre(genre: string): void{
    this.genre = genre;
    this.getBooks();
  }

  protected onSortChange(newSort: string) {
    this.sort = newSort;
    this.getBooks();
  }

  // TODO Add parameters
  private getBooks(): void{
    this.bookSubscription = this.bookService.getAll(true, this.filter, this.sort, 'title', this.currentPage, this.pageSize, this.genre).subscribe({
      next: (response) => {
        this.currentPage = response.pageable.pageNumber;

        this.totalElements = response.totalElements;

        this.bookList = response.content;

        this.isLoading = false;
      }
    });
  }
}
