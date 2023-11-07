import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BookService } from 'src/app/services/book/book.service';
import { Book } from 'src/app/shared/domain/book/book';
import { IIndexable } from 'src/app/shared/utils/interfaces/i-indexable';
import Swal from 'sweetalert2';

// TODO
// - Optimize to paginate manually like catalog
// - Add expandable
@Component({
  selector: 'app-list-book',
  templateUrl: './list-book.component.html',
  styleUrls: ['./list-book.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed, void', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('* <=> *', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ListBookComponent implements AfterViewInit, OnDestroy, OnInit {
  // Subcomponents
  @ViewChild(MatPaginator)
  protected paginator!: MatPaginator;

  @ViewChild(MatSort)
  protected sort!: MatSort;

  // Fields
  protected allowActivityUpdates = true;

  protected columnsToDisplay: string [] = ['title', 'parameters.author', 'active', 'price', 'stock', 'actions', 'expand'];

  protected data: Book[] = [];

  protected dataSource = new MatTableDataSource<Book>(this.data);

  protected expandedElement?: Book;

  protected isLoading = true;

  private booksSubsrciption?: Subscription;

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
    this.booksSubsrciption?.unsubscribe();
  }

  // Methods
  // Public methods
  /**
   * A lifecycle hook that is called after Angular has fully initialized a component's view.
   * Assigns the Paginator and the Sort components to the respective properties of the datasource to handle pages and sorting of the table.
   */
  public ngAfterViewInit(){
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

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
   * Filters the data of the table with the value of the input of the search bar.
   * @param filter - Value of the input field
   */
  protected applyFilter(filter: string){
    this.dataSource.filter = filter.trim().toLowerCase();
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
    this.allowActivityUpdates = false;
    this.isLoading = true;
    this.bookService.update(book.id, book).subscribe({
      complete: () => this.handleUpdateSuccessResponse(`Activity of ${book.title} updated successfully!`),
      error: () => this.handleUpdateErrorResponse(book, `Activity of ${book.title} could not be changed.`)
    })
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
    this.booksSubsrciption = this.bookService.getAll().subscribe({
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

    this.allowActivityUpdates = true;
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

  /**
   *The book list is sorted by the activity first and then by the title of the book
   * @param bookList - Book list that will be sorted.
   * @returns The sorted book list.
   * @deprecated
   */
  private sortBookListByActivityName(bookList: Book[]): Book[] {
    return bookList.sort((a, b) => {
      if (a.active && !b.active) {
        return -1;
      } else if (!a.active && b.active) {
        return 1;
      } else {
        // If both are active or both are inactive, compare by name
        return a.title.localeCompare(b.title);
      }
    });
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
          error: Swal.fire('An error ocurred, contact your support', '', 'warning');
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Changes are not saved', '', 'info')
      }
    })
  }
}
