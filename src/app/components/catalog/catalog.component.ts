import { Component, OnDestroy, OnInit } from '@angular/core';
import { Book } from 'src/app/shared/domain/book/book';
import { BookService } from 'src/app/services/book/book.service';
import { CartService } from 'src/app/services/cart/cart.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { StringValues } from 'src/app/shared/utils/string-values';

const ROWS_HEIGHT: { [id: number]: number} = { 1: 400, 3: 335, 4: 350 };

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit, OnDestroy {
  // Fields
  protected data: Book[] = [];

  protected cols = 3;

  protected dataLength = 0;

  protected dataPage = 0;

  protected dataPageEvent?: PageEvent;

  protected dataPageSize = StringValues.DEFAULT_PAGE_SIZE;

  protected dataPageSizeOptions: number[] = StringValues.DEFAULT_PAGE_SIZE_OPTIONS;

  protected genre?: string;

  protected isLoading = true;

  protected rowHeight = ROWS_HEIGHT[this.cols];

  private bookSubscription?: Subscription;

  private filter = '';

  private sort = 'asc';

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
    this.loadActiveBooks();
  }

  /**
   * Filters the data of the table with the value of the input of the search bar.
   * @param filter - Value of the input field
   */
  protected setFilter(filter: string){
    this.filter = filter;
  }

  protected onAddToCart(book: Book): void {
    this.cartService.addToCart({...book, quantity: 1});
  }

  protected onColumnsCountChange(colsNumber: number): void{
    this.cols = colsNumber;
    this.rowHeight = ROWS_HEIGHT[this.cols];
  }

  protected onPageChange(event: PageEvent): void {
    this.dataPageEvent = event;
    this.dataPage = event.pageIndex;
    this.dataPageSize = event.pageSize;
    this.loadActiveBooks();
  }

  protected onSearch(): void {
    this.loadActiveBooks();
  }

  protected onShowGenre(genre: string): void{
    this.genre = genre;
    this.loadActiveBooks();
  }

  protected onSortChange(newSort: string) {
    this.sort = newSort;
    this.loadActiveBooks();
  }

  private loadActiveBooks(): void{
    this.bookSubscription = this.bookService.getAll(true, this.filter, this.sort, 'title', this.dataPage, this.dataPageSize, this.genre).subscribe({
      next: (response) => {
        this.data = response.content;

        this.dataLength = response.totalElements;

        this.dataPage = response.pageable.pageNumber;

        this.isLoading = false;
      }
    });
  }
}
