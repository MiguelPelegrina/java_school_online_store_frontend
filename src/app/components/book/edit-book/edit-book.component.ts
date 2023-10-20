import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { BookFormatService } from 'src/app/services/book-format/book-format.service';
import { BookGenreService } from 'src/app/services/book-genre/book-genre.service';
import { BookService } from 'src/app/services/book/book.service';
import { ImageSelectorComponent } from 'src/app/shared/components/image-selector/image-selector.component';
import { Book } from 'src/app/shared/domain/book/book';
import { BookGenre } from 'src/app/shared/domain/book/book-genre/book-genre';
import { BookParametersFormat } from 'src/app/shared/domain/book/parameters/book-parameters-format/book-parameters-format';
import { StringValues } from 'src/app/shared/utils/string-values';

// TODO Check if anything is required for AddEdit
@Component({
  selector: 'app-edit-book',
  templateUrl: './edit-book.component.html',
  styleUrls: ['./edit-book.component.css']
})
export class EditBookComponent extends FormsModule implements OnInit {
  // Fields
  // Not sure if right
  @ViewChild(ImageSelectorComponent)
  protected imageSelector?: ImageSelectorComponent;

  // TODO Not sure if default values or undefined fields with ? and continous checking with if's and ngIf's is better
  protected book: Book = {
    active: true,
    genre: { name: "Thriller"},
    id: 0,
    image: '',
    isbn: '',
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

  protected genreTypes: BookGenre[] = [];

  protected file?: File;

  protected formatTypes: BookParametersFormat [] = [];

  protected id: number = 0;

  protected isBookLoaded: boolean = false;

  // Constructor
  constructor(
      private activatedRoute: ActivatedRoute,
      private bookService: BookService,
      private bookFormatService: BookFormatService,
      private bookGenreService: BookGenreService,
      private router: Router,
      private snackbar: MatSnackBar,
    ){
    super();
  }

  // Methods
  // Public methods
  public ngOnInit(): void {
    this.loadBook();

    this.bookGenreService.getAll().subscribe(bookGenreList => {
      this.genreTypes = bookGenreList;
    });
    this.bookFormatService.getAll().subscribe(bookFormatList => {
      this.formatTypes = bookFormatList;
    })
  }

  // Protected methods
  protected navigateToBookList(){
    this.router.navigate([`${StringValues.BOOK_URL}`])
    this.snackbar.open(`Book ${this.book.title} updated successfully!`);
  }

  protected onSubmit(){
    this.bookService.update(this.id, this.book).subscribe({
      complete: () => this.navigateToBookList(),
      error: () => this.snackbar.open(`Book ${this.book.title} could not be updated`)
    })
  }

  // Private methods
  /**
   *
   */
  private loadBook(){
    this.id = this.activatedRoute.snapshot.params['id'];
    this.bookService.getById(this.id).subscribe(response => {
      this.book = response;
      this.isBookLoaded = true;
    });
  }
}
