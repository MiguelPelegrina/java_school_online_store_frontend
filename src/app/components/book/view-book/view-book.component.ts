import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from 'src/app/services/book/book.service';
import { Book } from 'src/app/shared/domain/book/book';

/**
 * Angular component representing the view details page for a book.
 */
@Component({
  selector: 'app-view-book',
  templateUrl: './view-book.component.html',
  styleUrls: ['./view-book.component.css', '../../../app.component.css']
})
export class ViewBookComponent implements OnInit {
  // Fields
  protected id: number = 0;

  protected book: Book = {
    active: true,
    id: 0,
    image: '',
    isbn: '',
    price: 0.00,
    genre: { name: 'Thriller'},
    parameters: {
      active: true,
      author: '',
      id: 0,
      format: {
        name: 'Ebook'
      },
    },
    stock: 1,
    title: '',
  };

  protected image: string = '';

  protected isLoading: boolean = true;

  /**
   * Constructor of the component.
   * @param activatedRoute - Service to access the activated route
   * @param router - Service to navigate between routes
   * @param service - Service for managing books
   */
  constructor(private activatedRoute: ActivatedRoute, private router: Router, private service: BookService){}

  // Methods
  // Lifecycle hooks
   /**
   * Lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   * Retrieves the book ID from the route parameters and loads the book details from the service.
   */
  public ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.params['id'];
    this.service.getById(this.id).subscribe(response => {
      this.book = response;
      this.isLoading = false;
    });
  }

  // Protected
  /**
   * Navigates to the edit page for the specified book ID.
   * @param id - The ID of the book to edit
   */
  protected editBook(id: number){
    this.router.navigate(['books/edit', id]);
  }
}
