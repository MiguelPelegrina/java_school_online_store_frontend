import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { map, merge, Observable, startWith, Subscription, switchMap } from 'rxjs';
import { BookService } from 'src/app/services/book/book.service';
import { SearchBarComponent } from 'src/app/components/search-bar/search-bar.component';
import { Book } from 'src/app/shared/domain/book/book';
import { ANIMATION_DURATION, StringValues } from 'src/app/shared/utils/string-values';

/**
 * Angular component representing a list of books with search, sorting, and pagination features.
 */
@Component({
  selector: 'app-list-book',
  templateUrl: './list-book.component.html',
  styleUrls: ['./list-book.component.css', '../../../app.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed, void', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate(ANIMATION_DURATION)),
      transition('expanded <=> void', animate(ANIMATION_DURATION))
    ]),
  ],
})
export class ListBookComponent implements AfterViewInit, OnDestroy {
  // Subcomponents
  @ViewChild(MatPaginator)
  protected paginator!: MatPaginator;

  @ViewChild(SearchBarComponent)
  protected searchBar!: SearchBarComponent;

  @ViewChild(MatSort)
  protected sort!: MatSort;

  // Fields
  protected allowUpdates = true;

  protected columnsToDisplay: string [] = ['title', 'parameters.author', 'active', 'price', 'stock', 'actions'];

  protected data: Book[] = [];

  protected data$ = new Observable<Book[]>();

  protected dataLength = 0;

  protected dataPage = 0;

  protected dataPageSize = StringValues.DEFAULT_PAGE_SIZE;

  protected dataPageSizeOptions: number[] = StringValues.DEFAULT_PAGE_SIZE_OPTIONS;

  protected dataSource = new MatTableDataSource<Book>(this.data);

  protected expandedElement?: Book;

  protected isLoading = true;

  private active? = undefined;

  private bookSubscription?: Subscription;

  private filter = '';

  // Constructor
  /**
   * Constructor of the component.
   * @param bookService - Service that gets all the books
   * @param snackbar - Snackbar to inform the user of events
   */
  constructor(
    private bookService: BookService,
    private snackbar: MatSnackBar,
  ){}

  // Methods
  // Public methods
  /**
   * A lifecycle hook that is called after Angular has fully initialized a component's view. Sets up subscriptions for sorting, pagination, and search bar events.
   */
  public ngAfterViewInit(){
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    this.data$ = merge(this.sort.sortChange, this.paginator.page, this.searchBar.searchEvent).pipe(
      startWith({}),
      switchMap(() => {
        this.isLoading = true;

        this.dataPage = this.paginator.pageIndex;

        this.dataPageSize = this.paginator.pageSize;

        return this.bookService.getAll(this.active, this.filter, this.sort.direction, this.sort.active, this.paginator.pageIndex, this.dataPageSize);
      }),
      map(response => {
        this.isLoading = false;

        if(response === null){
          return [];
        }

        this.dataLength = response.totalElements;

        this.dataPage = response.pageable.pageNumber;

        return response.content;
      }),
    )
  }

  // Lifecycle hooks
  /**
   * Lifecycle hook that is called when a directive, pipe, or service is destroyed.
   * Used for any custom cleanup that needs to occur when the instance is destroyed.
   */
  public ngOnDestroy(): void {
    this.bookSubscription?.unsubscribe();
  }

  // Protected methods
  /**
   * Sets the book 'active' state. If it was active before, it's not active now and viceversa. Disables the toggle button during the transaction until success or error.
   * @param book Book whose 'active' state will be changed.
   */
  protected setBookActivity(book: Book){
    this.allowUpdates = false;
    this.isLoading = true;

    this.bookSubscription = this.bookService.update(book.id, book).subscribe({
      next: () => this.handleUpdateSuccessResponse(`Activity of ${book.title} updated successfully!`),
      error: () => this.handleUpdateErrorResponse(book, `Activity of ${book.title} could not be changed.`)
    })
  }

  /**
   * Sets the filter string for searching books.
   * @param filter - Value to filter books.
   */
  protected setFilter(filter: string){
    this.filter = filter;
  }

  // Private methods
  /**
   * Retrieves all elements from the database. Hides the progress bar when the data is loaded.
   */
  private loadAllBooks(){
    this.bookSubscription = this.bookService.getAll().subscribe({
      next: (response) => {
        this.data = response.content;

        this.dataSource.data = response.content;

        this.isLoading = false;
      }
    });
  }

  /**
   * Handles the response when updating the state of a book from 'active' to 'inactive' or viceversa. Sets the value of 'active',
   * hides the progress bar, allows further changes and informs the user that the modification was successful.
   * @param book Book that was updated.
   * @param message Message to the user.
   */
  private handleUpdateErrorResponse(book: Book, message: string){
    book.active = !book.active;

    this.handleUpdateResponse(message);
  }

  /**
   * Handles the response when trying to update the state of a book. Hides the progress bar, allows further changes and
   * informs the user about the result of the modification.
   * @param message Message to the user.
   */
  private handleUpdateResponse(message: string){
    this.snackbar.open(message);

    this.isLoading = false;

    this.allowUpdates = true;
  }

  /**
   * Handles the error when trying to update the state of a book from 'active' to 'inactive' or viceversa. Hides the progress bar,
   * allows further changes and informs the user that the modification could not be done.
   * @param message Message to the user.
   */
  private handleUpdateSuccessResponse(message: string){
    this.loadAllBooks();

    this.handleUpdateResponse(message);
  }
}
