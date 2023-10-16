import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BookService } from 'src/app/services/book/book.service';
import { Book } from 'src/app/shared/domain/book/book';
import { BookGenres } from 'src/app/shared/domain/enums/book-genres';
import { BookParameterFormats } from 'src/app/shared/domain/enums/book-parameter-formats';
import { StringValues } from 'src/app/shared/string-values';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.css']
})
export class AddBookComponent extends FormsModule{
  // TODO This might not be really sustainable, dont initialize?
  protected book: Book = {
    id: 0,
    title: '',
    price: 0,
    isbn: '',
    author: '',
    genre: BookGenres.Thriller,
    parameters: BookParameterFormats.Ebook,
    stock: 1,
    isActive: false,
  };

  // TODO This should call a service of book genre --> not sustainable otherwise
  protected genreTypes = Object.values(BookGenres);

  constructor(private service: BookService, private router: Router){
    super();
  }

  protected onSubmit(){
    this.saveBook();
  }

  protected saveBook(){
    this.service.create(this.book).subscribe(response => {
      this.navigateToBookList();
    })
  }

  private navigateToBookList(){
    this.router.navigate([`${StringValues.BASE_BOOK_URL}`])
  }
}
