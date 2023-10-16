import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
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
  protected books: Book[] = [];

  // Constructor
  constructor(
    private service: BookService,
    private router: Router,
    private snackbar: MatSnackBar,
  ){}

  // Methods
  // Public
  public ngOnInit(): void {
    this.getAllBooks();
  }

  // Protected
  protected addBook(){
    this.router.navigate(['books/add']);
  }

  protected editBook(id: number){
    this.router.navigate(['books/edit', id]);
  }

  protected setBookActivity(book: Book){
    this.service.update(book.id, book).subscribe(response => {
      this.getAllBooks();
      this.snackbar.open(`Activity of ${book.title} updated!`);
    })
  }

  protected viewBookDetails(id: number){
    this.router.navigate(['books/view', id]);
  }


  // Private
  private getAllBooks(){
    this.service.getAll().subscribe(bookList => {
      this.sortBookListByActivtyName(bookList);
      this.books = bookList;
    });
  }

  /**
   *
   * @param bookList
   * @returns
   */
  private sortBookListByActivtyName(bookList: Book[]): Book[] {
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

  // Deprecated
  // ONLY SOFT DELETE IS ENABLED
  /**
   *
   * @param book
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
