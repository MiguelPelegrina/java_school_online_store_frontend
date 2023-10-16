import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from 'src/app/services/book/book.service';
import { Book } from 'src/app/shared/domain/book/book';

@Component({
  selector: 'app-edit-book',
  templateUrl: './edit-book.component.html',
  styleUrls: ['./edit-book.component.css']
})
export class EditBookComponent implements OnInit{
  // Fields
  // TODO Not sure if default values or undefined fields with ? and continous checking with if's and ngIf's is better
  protected id: number = 0;
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

  // Constructor
  constructor(private activatedRoute: ActivatedRoute, private router: Router, private service: BookService){}

  // Methods
  // Public
  public ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.params['id'];
    this.service.getById(this.id).subscribe(response => {
      this.book = response;
    });
  }


}
