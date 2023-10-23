import { Component, OnInit } from '@angular/core';
import { Book } from 'src/app/shared/domain/book/book';
import { BookService } from 'src/app/services/book/book.service';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit{
  protected bookList: Book[] = [];

  protected filteredBookList: Book [] = [];

  constructor(private service: BookService){}

  public ngOnInit(): void {
    this.service.getAll().subscribe(response => {
      response.map(book => {
        if(book.active){
          this.bookList.push(book);
        }
      });
    });

    this.filteredBookList = this.bookList;
  }

  /**
   * Filters the data of the table with the value of the input of the search bar.
   * @param filter - Value of the input field
   */
  protected applyFilter(filter: string){
    if(!filter){
      this.filteredBookList = this.bookList;
    }

    this.filteredBookList = this.bookList.filter(
      book => book.title.toLowerCase().includes(filter.toLowerCase())
    )
  }
}
