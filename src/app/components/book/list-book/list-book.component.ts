import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { catchError, map, merge, of, startWith, Subscription, switchMap } from 'rxjs';
import { BookService } from 'src/app/services/book/book.service';
import { SearchBarComponent } from 'src/app/shared/components/search-bar/search-bar.component';
import { Book } from 'src/app/shared/domain/book/book';
import { IIndexable } from 'src/app/shared/utils/interfaces/i-indexable';
import { StringValues } from 'src/app/shared/utils/string-values';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-book',
  templateUrl: './list-book.component.html',
  styleUrls: ['./list-book.component.css', '../../../app.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed, void', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
      transition('expanded <=> void', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ]),
  ],
})
export class ListBookComponent implements AfterViewInit, OnDestroy, OnInit {
  // Subcomponents
  @ViewChild(MatPaginator)
  protected paginator!: MatPaginator;

  @ViewChild(MatSort)
  protected sort!: MatSort;

  @ViewChild(SearchBarComponent)
  protected searchBar!: SearchBarComponent;

  // Fields
  protected allowUpdates = true;

  protected columnsToDisplay: string [] = ['title', 'parameters.author', 'active', 'price', 'stock', 'actions'];

  protected data: Book[] = [];

  protected dataLength = 0;

  protected dataPage = 0;

  protected dataPageSize = StringValues.DEFAULT_PAGE_SIZE;

  protected dataPageSizeOptions: number[] = StringValues.DEFAULT_PAGE_SIZE_OPTIONS;

  protected dataSource = new MatTableDataSource<Book>(this.data);

  protected expandedElement?: Book;

  protected isLoading = true;

  private booksSubscription?: Subscription;

  private active? = undefined;

  private filter = '';

  // Constructor
  /**
   * Constructor of the component.
   * @param bookService - Service that gets all the books
   * @param snackbar - Snackbar to inform the user of events
   * @param router - Router to nagivate the user
   */
  constructor(
    private bookService: BookService,
    private snackbar: MatSnackBar,
    private router: Router,
  ){}

  /**
   * A lifecycle hook that is called when a directive, pipe, or service is destroyed. Used for any custom cleanup that needs to occur when the instance is destroyed.
   */
  public ngOnDestroy(): void {
    this.booksSubscription?.unsubscribe();
  }

  // Methods
  // Public methods
  /**
   * A lifecycle hook that is called after Angular has fully initialized a component's view.
   * Assigns the Paginator and the Sort components to the respective properties of the datasource to handle pages and sorting of the table.
   */
  public ngAfterViewInit(){
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page, this.searchBar.searchEvent).pipe(
      startWith({}),
      switchMap(() => {
        this.isLoading = true;

        this.dataPage = this.paginator.pageIndex;

        this.dataPageSize = this.paginator.pageSize;

        return this.bookService.getAll(this.active, this.filter, this.sort.direction, this.sort.active, this.paginator.pageIndex, this.dataPageSize).pipe(catchError(() => of(null)));
      }),
      map(response => {
        if(response === null){
          return [];
        }
        this.isLoading = false;

        this.dataLength = response.totalElements;

        this.dataPage = response.pageable.pageNumber;

        return response.content;
      }),
    ).subscribe(data => (this.dataSource = data))

    // TODO Might need to assign it after every data change
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch(property) {
        case 'parameters.author': return item.parameters.author;
        default: return (item as IIndexable<Book>)[property];
      }
    }
  }

  /**
   * A lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   * Fills the table with data from the database and sets the filter of the searchbar to search by book title or book author
   */
  public ngOnInit(): void {
    this.getAllBooks();

    this.setFilterToSearchByTitleOrAuthor();
  }

  // Protected methods
  /**
   * Navigates the user to the 'Add book' page, allowing them to create a new one.
   */
  protected addBook(){
    this.router.navigate(['books/add']);
  }

  /**
   * Navigates the user to the 'Edit book' page, allowing them to modify an existing one.
   * @param id Id of the chosen book.
   */
  protected editBook(id: number){
    this.router.navigate(['books/edit', id]);
  }

  /**
   * Sets the book 'active' state. If it was active before, it's not active now and viceversa. Disables the toggle button during the transaction until success or error.
   * @param book Book whose 'active' state will be changed.
   */
  protected setBookActivity(book: Book){
    this.allowUpdates = false;
    this.isLoading = true;

    this.bookService.update(book.id, book).subscribe({
      complete: () => this.handleUpdateSuccessResponse(`Activity of ${book.title} updated successfully!`),
      error: () => this.handleUpdateErrorResponse(book, `Activity of ${book.title} could not be changed.`)
    })
  }

  protected setFilter(filter: string){
    this.filter = filter;
  }

  /**
   * Navigates the user to the 'View book' page, allowing them to see more details of the chosen book.
   * @param id Id of the chosen book.
   */
  protected viewBookDetails(id: number){
    this.router.navigate(['books/view', id]);
  }

  // Private methods
  /**
   * Retrieves all elements from the database. Hides the progress bar when the data is loaded.
   */
  private getAllBooks(){
    this.booksSubscription = this.bookService.getAll().subscribe({
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
    this.getAllBooks();

    this.handleUpdateResponse(message);
  }

  /**
   * Sets the filter of the book datasource. The datasource will only consist of those elements whose title or author contain the filter.
   */
  private setFilterToSearchByTitleOrAuthor() {
    this.dataSource.filterPredicate = function (record, filter){
      let found = false;

      if(record.parameters.author.toLocaleLowerCase().includes(filter.toLocaleLowerCase()) ||
        record.title.toLocaleLowerCase().includes(filter.toLocaleLowerCase())
      ){
        found = true;
      }

      return found;
    }
  }

  // Deprecated methods
  // ONLY SOFT DELETE IS ENABLED
  /**
   *
   * @param book
   * @deprecated
   */
  private deleteBook(book: Book){
    Swal.fire({
      title: `Do you really want to delete ${book.title}?`,
      icon: 'warning',
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if(result.isConfirmed){
        this.bookService.delete(book.id).subscribe(response =>{
          this.getAllBooks();
          Swal.fire('Delete successful', '', 'success');
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Changes are not saved', '', 'info')
      }
    })
  }
}
