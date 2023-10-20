import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { BookFormatService } from 'src/app/services/book-format/book-format.service';
import { BookGenreService } from 'src/app/services/book-genre/book-genre.service';
import { BookService } from 'src/app/services/book/book.service';
import { Book } from 'src/app/shared/domain/book/book';
import { BookParametersFormat } from 'src/app/shared/domain/book/parameters/book-parameters-format/book-parameters-format';
import { BookGenre } from 'src/app/shared/domain/book/book-genre/book-genre';
import { StringValues } from 'src/app/shared/utils/string-values';
import { ImageSelectorComponent } from 'src/app/shared/components/image-selector/image-selector.component';

// TODO Check if anything is required for AddEdit
@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.css']
})
export class AddBookComponent extends FormsModule implements OnInit{
  // Fields
  // Not sure if right
  @ViewChild(ImageSelectorComponent)
  protected imageSelector?: ImageSelectorComponent;

  // TODO This might not be really sustainable, dont initialize?
  protected book: Book = {
    active: true,
    id: 0,
    image: '',
    isbn: '',
    genre: { name: "Thriller"},
    parameters: {
      active: true,
      author: '',
      format: {
        name: "Ebook"
      },
      id: 0,
    },
    price: 0.00,
    stock: 1,
    title: '',
  };

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
  // Protected methods
  protected onSubmit(){
    this.saveBook();
  }

  protected saveBook(){
    this.bookService.create(this.book).subscribe({
      complete: () => this.handleCreateSuccessResponse(),
      error: () => this.handleCreateErrorResponse()
    })
  }

  // Private methods
  private handleCreateSuccessResponse(){
    this.snackbar.open('Book saved');
    this.navigateToBookList();
  }

  private handleCreateErrorResponse(){
    this.snackbar.open('Book could not be saved');
  }

  private navigateToBookList(){
    this.router.navigate([`${StringValues.BOOK_URL}`])
  }
}
