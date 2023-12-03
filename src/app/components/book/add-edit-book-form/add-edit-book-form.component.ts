import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BookFormat } from '../../../shared/domain/book/parameters/book-parameters-format/book-parameters-format';
import { BookGenre } from '../../../shared/domain/book/book-genre/book-genre';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { BookService } from 'src/app/services/book/book.service';
import { BookFormatService } from 'src/app/services/book/format/book-format.service';
import { BookGenreService } from 'src/app/services/book/genre/book-genre.service';
import { AbstractForm } from 'src/app/shared/components/abstract-form';
import { allowedImageExtensions, requiredFileType } from 'src/app/shared/utils/required-file-type';
import { getBase64, informUserOfError } from 'src/app/shared/utils/utils';

/**
 * Component representing a form for adding or editing a book.
 */
@Component({
  selector: 'app-add-edit-book-form',
  templateUrl: './add-edit-book-form.component.html',
  styleUrls: ['./add-edit-book-form.component.css', '../../../app.component.css'],
})
export class AddEditBookFormComponent extends AbstractForm implements OnDestroy, OnInit {
  // Fields
  protected formatTypes: BookFormat[] = []

  protected genreTypes: BookGenre[] = []

  protected id?: number;

  protected image: string | ArrayBuffer | null = '';

  protected isAddMode?: boolean;

  protected isLoading = true;

  protected submitted = false;

  protected selectedGenre: string = '';

  protected selectedFormat: string = '';

  private booksSubscription?: Subscription;

  private bookFormatsSubscription?: Subscription;

  private bookGenresSubscription?: Subscription;

  // Constructor
  /**
   * Constructor of the component.
   * @param bookService - Service for managing books
   * @param bookFormatService - Service for managing book formats
   * @param bookGenreService - Service for managing book genres
   * @param fb - FormBuilder for working with forms
   * @param route - ActivatedRoute for accessing route parameters
   * @param router - Router for navigation
   */
  constructor(
    private bookService: BookService,
    private bookFormatService: BookFormatService,
    private bookGenreService: BookGenreService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    super();
  }

  // Methods
  // Lifecycle hooks
  /**
   * Lifecycle hook that is called when a directive, pipe, or service is destroyed. Used for any custom cleanup that needs to occur when the instance is destroyed.
   */
  public ngOnDestroy(): void {
    this.booksSubscription?.unsubscribe();
    this.bookFormatsSubscription?.unsubscribe();
    this.bookGenresSubscription?.unsubscribe()
  }

   /**
   * Lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   * Initializes the form, loads available genres and formats, and loads the book if in edit mode.
   */
  public ngOnInit(): void {
    // Get the book id
    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;

    if(this.isAddMode){
      this.isLoading = false;
    }

    this.loadGenres();

    this.loadFormats();

    // Generate the form
    this.form = this.fb.group({
      active: [false, Validators.required],
      id: [''],
      image: ['', Validators.required],
      isbn: ['', Validators.required],
      genre: ['', Validators.required],
      parameters: this.fb.group({
        author: ['', Validators.required],
        id:[''],
        format: ['', Validators.required],
        active: [true],
      }),
      price: ['', Validators.required],
      stock: ['', Validators.required],
      title: ['', Validators.required],
    })

    if(this.id){
      this.loadBook();
    }
  }

  // Protected methods
  /**
   * Event handler for file selection in the form. Converts the selected image file to a base64 string.
   * @param event - The file selection event
   */
  protected onFileSelected(event: any): void{
    const inputElement: HTMLInputElement = event.target;

    if (inputElement.files && inputElement.files[0]) {
      const file = event.target.files[0];

      if(file && requiredFileType(file, allowedImageExtensions)){
        getBase64(file, (base64String) => {
          this.image = base64String;
          this.form.get('image')?.setValue(this.image);
        });
      } else {
        Swal.fire('Wrong image type',`The file needs to be in one of the following types: ${allowedImageExtensions}`,'warning');

        event.target.value = null;
      }
    }
  }

  /**
   * Resets the currently selected image in the form.
   */
  protected resetImage(){
    this.image = '';
    this.form.get('image')?.setValue('');
  }

  /**
   * Event handler for form submission. Submits the form data for creating or updating a book.
   */
  protected onSubmit(){
    this.submitted = true;

    if(!this.form.invalid){
      this.isLoading = true;

      if(this.isAddMode){
        this.createBook();
      } else {
        this.updateBook();
      }
    }
  }

  // Private methods
  /**
   * Submits a request to create a new book using the form data.
   */
  private createBook(){
    this.booksSubscription = this.bookService.create(this.form.value).subscribe({
        next: () => {
          this.handleSuccessResponse('created');
        },
        error: (error) => {
          informUserOfError(error);
        }
      })
  }

  /**
   * Handles success response from a book creation or update operation.
   * @param action - The action (created or updated)
   */
  private handleSuccessResponse(action: string){
    Swal.fire(`Book ${action}!`,`The book ${this.form.value.title} has been ${action} successfully`,`success`);
    this.router.navigate(['/books']);
  }

  /**
   * Loads the details of an existing book when in edit mode.
   */
  private loadBook(): void {
    this.booksSubscription = this.bookService.getById(this.id!).subscribe({
      next: (response) => {
        this.selectedFormat = response.parameters.format.name;
        this.selectedGenre = response.genre.name;

        if(response.image){
          this.image = response.image;
        }

        this.form.patchValue(response);

        this.isLoading = false;
      },
      error: (error) => {
        informUserOfError(error);
      }
    });
  }

  /**
   * Loads the list of available book formats for selection in the form.
   */
  private loadFormats(): void {
    this.bookGenresSubscription = this.bookFormatService.getAll().subscribe({
      next: (bookFormatList) => {
        this.formatTypes = bookFormatList
      },
      error: (error) => {
        informUserOfError(error)
      }
    })
  }

  /**
   * Loads the list of available book genres for selection in the form.
   */
  private loadGenres(): void {
    this.bookFormatsSubscription = this.bookGenreService.getAll().subscribe({
      next: (bookGenreList) => {
        this.genreTypes = bookGenreList
      },
      error: (error) => {
        informUserOfError(error)
      }
    });
  }

  /**
   * Submits a request to update an existing book using the form data.
   */
  private updateBook(): void{
    this.booksSubscription = this.bookService.update(this.id!, this.form.value).subscribe({
        next: () => {
          this.handleSuccessResponse('updated');
        },
        error: (error) => {
          informUserOfError(error);
        }
      })
  }
}
