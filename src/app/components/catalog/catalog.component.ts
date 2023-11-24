import { Component, OnDestroy, OnInit } from '@angular/core';
import { Book } from 'src/app/shared/domain/book/book';
import { BookService } from 'src/app/services/book/book.service';
import { CartService } from 'src/app/services/cart/cart.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { StringValues } from 'src/app/shared/utils/string-values';
import { NgxPermissionsService } from 'ngx-permissions';
import { AuthUtils } from 'src/app/shared/utils/auth-utils';
import { informUserOfError } from 'src/app/shared/utils/utils';

const ROWS_HEIGHT: { [id: number]: number} = { 1: 400, 3: 335, 4: 350 };

/**
 * Angular component representing a catalog of books with filtering and pagination options.
 */
@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css', '../../app.component.css']
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
   * Constructor of the component.
   * @param bookService - Service for managing books
   * @param cartService - Service for managing the shopping cart
   * @param permissionsService - Service for managing user permissions
   */
  constructor(private bookService: BookService, private cartService: CartService, private permissionsService: NgxPermissionsService){}

  /**
   * A lifecycle hook that is called when a directive, pipe, or service is destroyed. Used for any custom cleanup that needs to occur when the instance is destroyed.
   */
  public ngOnDestroy(): void {
    this.bookSubscription?.unsubscribe();
  }

  /**
   * Lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   * Loads user roles and initializes the catalog with active books.
   */
  public ngOnInit(): void {
    this.permissionsService.loadPermissions(AuthUtils.getRoles())
    this.loadActiveBooks();
  }

  /**
   * Filters the data of the table with the value of the input of the search bar.
   * @param filter - Value of the input field
   */
  protected setFilter(filter: string){
    this.filter = filter;
  }

  /**
   * Event handler for the "Add to Cart" button click. Adds the selected book to the shopping cart.
   * @param book - The book to be added to the cart
   */
  protected onAddToCart(book: Book): void {
    this.cartService.addToCart({...book, quantity: 1});
  }

  /**
   * Event handler for the change in the number of columns in the catalog grid.
   * Updates the number of columns and adjusts the row height accordingly.
   * @param colsNumber - The new number of columns
   */
  protected onColumnsCountChange(colsNumber: number): void{
    this.cols = colsNumber;
    this.rowHeight = ROWS_HEIGHT[this.cols];
  }

  /**
   * Event handler for page change in the catalog pagination. Loads the books for the new page.
   * @param event - The PageEvent object containing page information
   */
  protected onPageChange(event: PageEvent): void {
    this.dataPageEvent = event;
    this.dataPage = event.pageIndex;
    this.dataPageSize = event.pageSize;
    this.loadActiveBooks();
  }

  /**
   * Event handler for the search button click. Loads the books based on the current search criteria.
   */
  protected onSearch(): void {
    this.loadActiveBooks();
  }

  /**
   * Event handler for selecting a genre in the catalog filters. Loads the books based on the selected genre.
   * @param genre - The selected genre
   */
  protected onShowGenre(genre: string): void{
    this.genre = genre;
    this.loadActiveBooks();
  }

  /**
   * Event handler for changing the sort order in the catalog. Loads the books based on the new sort order.
   * @param newSort - The new sort order ('asc' or 'desc')
   */
  protected onSortChange(newSort: string) {
    this.sort = newSort;
    this.loadActiveBooks();
  }

  /**
   * Loads the active books in the catalog based on the current filters, sorting, and pagination.
   */
  private loadActiveBooks(): void{
    this.bookSubscription = this.bookService.getAll(true, this.filter, this.sort, 'title', this.dataPage, this.dataPageSize, this.genre).subscribe({
      next: (response) => {
        this.data = response.content;

        this.dataLength = response.totalElements;

        this.dataPage = response.pageable.pageNumber;

        this.isLoading = false;
      },
      error: (error) => {
        informUserOfError(error);
        this.isLoading = false;
      }
    });
  }
}
