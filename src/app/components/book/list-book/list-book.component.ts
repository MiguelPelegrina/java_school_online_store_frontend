import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { BookService } from 'src/app/services/book/book.service';
import { Book } from 'src/app/shared/domain/book/book';

@Component({
  selector: 'app-list-book',
  templateUrl: './list-book.component.html',
  styleUrls: ['./list-book.component.css']
})
export class ListBookComponent implements OnInit {
  // Fields
  protected allowActivityUpdates: boolean = true;

  protected books: Book[] = [];

  protected bookDatasource = new MatTableDataSource(this.books);

  protected displayedColumns: string [] = ['title', 'author', 'active', 'price', 'stock', 'actions'];

  protected isLoading: boolean = true;

  // Constructor
  constructor(
    private service: BookService,
    private snackbar: MatSnackBar,
    private router: Router,
  ){}

  // Methods
  // Public methods
  /**
   * Fill the table with data from the database.
   */
  public ngOnInit(): void {
    this.getAllBooks();
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
    this.allowActivityUpdates = false;
    this.isLoading = true;
    this.service.update(book.id, book).subscribe({
      // TODO Possible implementation of multi-language support.
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
   * Retrieves all books from the database and sorts them by 'active' first and then alphabetically by book 'title' (A-Z).
   */
  private getAllBooks(){
    this.service.getAll().subscribe(bookList => {
      this.sortBookListByActivityName(bookList);
      this.books = bookList;
      this.bookDatasource.data = this.books;
      this.isLoading = false;
    });
  }

  /**
   * Handles the response when updating the state of a book from 'active' to 'inactive' or viceversa. Resets the value of 'active',
   * terminates the progress bar, allows further changes and informs the user that the modification was successful.
   * @param book Book that was updated.
   * @param message Message to the user.
   */
  private handleUpdateErrorResponse(book: Book, message: string){
    book.active = !book.active;
    this.handleUpdateResponse(message);
  }

  /**
   * terminates the progress bar, allows further changes and informs the user about the result of the modification.
   * @param message Message to the user.
   */
  private handleUpdateResponse(message: string){
    this.isLoading = false;
    this.allowActivityUpdates = true;
    this.snackbar.open(message);
  }

  /**
   * Handles the error when trying to update the state of a book from 'active' to 'inactive' or viceversa. Terminates the progress bar,
   * allows further changes and informs the user that the modification could not be done.
   * @param message
   */
  private handleUpdateSuccessResponse(message: string){
    this.getAllBooks();
    this.handleUpdateResponse(message);
  }

  // TODO Abstract it?
  /**
   *
   * @param bookList
   * @returns
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
  /*protected deleteBook(book: Book){
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
        this.service.delete(book.id).subscribe(response =>{
          this.getAllBooks();
          Swal.fire('Delete successful', '', 'success');
          error: Swal.fire('An error ocurred, contact your support', '', 'warning');
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Changes are not saved', '', 'info')
      }
    })
  }*/
}
