import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { BookFormatService } from 'src/app/services/book-format/book-format.service';
import { BookGenreService } from 'src/app/services/book-genre/book-genre.service';
import { BookService } from 'src/app/services/book/book.service';
import { Book } from 'src/app/shared/domain/book/book';
import { BookParametersFormat } from 'src/app/shared/domain/book/parameters/book-parameters-format/book-parameters-format';
import { BookGenre } from 'src/app/shared/domain/book/book-genre/book-genre';
import { StringValues } from 'src/app/shared/string-values';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.css']
})
export class AddBookComponent extends FormsModule implements OnInit{
  // Fields
  // TODO This might not be really sustainable, dont initialize?
  protected book: Book = {
    id: 0,
    title: '',
    price: 0.00,
    isbn: '',
    genre: { name: "Thriller"},
    parameters: {
      id: 0,
      author: '',
      format: {
        name: "Ebook"
      },
      active: true,
    },
    stock: 1,
    active: true,
  };

  protected fileUrl: string | ArrayBuffer | null = null;

  protected genreTypes: BookGenre [] = [];

  protected formatTypes: BookParametersFormat [] = [];

  // Constructor
  constructor(
    private router: Router,
    private bookGenreService: BookGenreService,
    private bookFormatService: BookFormatService,
    private bookService: BookService,
    private snackbar: MatSnackBar){
    super();
  }

  public ngOnInit(): void {
    this.bookGenreService.getAll().subscribe(bookGenreList => {
      this.genreTypes = bookGenreList;
    });
    this.bookFormatService.getAll().subscribe(bookFormatList => {
      this.formatTypes = bookFormatList;
    })
  }

  // Methods
  // Protected
  protected onFileSelected(event: any): void{
    const inputElement: HTMLInputElement = event.target;
    if (inputElement.files && inputElement.files[0]) {
      const file = event.target.files[0];

      const reader = new FileReader();

      reader.onload = e => this.fileUrl = reader.result;

      reader.readAsDataURL(file);
    }
  }

  protected onSubmit(){
    this.saveBook();
  }

  protected saveBook(){
    this.bookService.create(this.book).subscribe(response => {
      this.snackbar.open('Book saved');
      this.navigateToBookList();
    })
  }

  // Private
  private navigateToBookList(){
    this.router.navigate([`${StringValues.BOOK_URL}`])
  }
}
