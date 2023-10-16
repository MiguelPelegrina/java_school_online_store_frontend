import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookService } from 'src/app/services/book/book.service';
import { Book } from 'src/app/shared/domain/book/book';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-book',
  templateUrl: './list-book.component.html',
  styleUrls: ['./list-book.component.css']
})
export class ListBookComponent implements OnInit {
  // Fields
  protected books: Book[] = [];

  // Constructor
  constructor(private service: BookService, private router: Router){}

  // Methods
  // Public
  public ngOnInit(): void {
    this.getAllBooks();
  }

  protected setBookActivity(book: Book){
    console.log(book);
    this.service.update(book.id, book).subscribe(response => {
      this.getAllBooks();
    })
  }

  protected deleteBook(id: number){
    Swal.fire({
      title: `Do you really want to delete ${name}?`,
      icon: 'warning',
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if(result.isConfirmed){
        this.service.delete(id).subscribe(response =>{
          this.getAllBooks();
          Swal.fire('Delete successful', '', 'success');
          error: Swal.fire('An error ocurred, contact your support', '', 'warning');
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Changes are not saved', '', 'info')
      }
    })
  }

  protected editBook(id: number){
    this.router.navigate([`$`]);
  }

  protected viewBookDetails(id: number){
    this.router.navigate([`$`]);
  }


  // Private
  private getAllBooks(){
    this.service.getAll().subscribe(bookList => {
      //this.sortBookListByName(bookList);
      this.books = bookList;
    });
  }
}
