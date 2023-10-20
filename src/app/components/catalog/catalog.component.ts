import { Component, OnInit } from '@angular/core';
import { BookCardComponent } from '../book/book-card/book-card.component';
import { Book } from 'src/app/shared/domain/book/book';
import { BookService } from 'src/app/services/book/book.service';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit{
  protected bookList: Book[] = [];

  constructor(private service: BookService){}

  ngOnInit(): void {
    this.service.getAll().subscribe(response => {
      response.map(book => {
        if(book.active){
          this.bookList.push(book);
        }
      });
    })
  }
}
