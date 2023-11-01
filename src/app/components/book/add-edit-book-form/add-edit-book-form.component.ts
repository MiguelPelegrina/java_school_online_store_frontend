import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BookFormatService } from 'src/app/services/book/format/book-format.service';
import { BookGenreService } from 'src/app/services/book/genre/book-genre.service';
import { BookService } from 'src/app/services/book/book.service';
import { BookFormat } from '../../../shared/domain/book/parameters/book-parameters-format/book-parameters-format';
import { BookGenre } from '../../../shared/domain/book/book-genre/book-genre';
import { getBase64 } from 'src/app/shared/utils/utils';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';

// TODO Document
@Component({
  selector: 'app-add-edit-book-form',
  templateUrl: './add-edit-book-form.component.html',
  styleUrls: ['./add-edit-book-form.component.css', '../../../app.component.css'],
})
export class AddEditBookFormComponent implements OnDestroy, OnInit {
  // Fields
  protected booksSubscription?: Subscription;

  protected bookFormatsSubscription?: Subscription;

  protected bookGenresSubscription?: Subscription;

  protected form!: FormGroup;

  protected formatTypes: BookFormat[] = []

  protected genreTypes: BookGenre[] = []

  protected id?: number;

  protected image: string | ArrayBuffer | null = '';

  protected isAddMode?: boolean;

  protected loading = true;

  protected submitted = false;

  protected selectedGenre: string = '';

  protected selectedFormat: string = '';

  // Constructor
  /**
   * Default constructor
   * @param bookService
   * @param bookFormatService
   * @param bookGenreService
   * @param formBuilder
   * @param route
   * @param router
   * @param snackbar
   */
  constructor(
    private bookService: BookService,
    private bookFormatService: BookFormatService,
    private bookGenreService: BookGenreService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
  ) {}


  // Methods
  // Public methods
  public ngOnDestroy(): void {
    this.bookFormatsSubscription?.unsubscribe();
    this.bookGenresSubscription?.unsubscribe()
  }

  /**
   *
   */
  public ngOnInit(): void {
    // Get the book id
    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;

    if(this.isAddMode){
      this.loading = false;
    }

    this.loadGenres();

    this.loadFormats();

    // Generate the form
    this.form = this.formBuilder.group({
      // TODO Not sure if right, should I use form?.value instead of empty values?
      active: [false, Validators.required],
      id: [''],
      image: ['', Validators.required],
      isbn: ['', Validators.required],
      genre: ['', Validators.required],
      parameters: this.formBuilder.group({
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
   * Gets access to form fields
   */
  protected get f(){
    return this.form.controls;
  }

  protected getErrorMessage(value: string){
    if(this.form.controls[value].hasError('required')){
      return "You must enter a valid value";
    }

    return this.form.controls[value].hasError(value) ? 'Not a valid value' : '';
  }

  protected onFileSelected(event: any): void{
    const inputElement: HTMLInputElement = event.target;

    if (inputElement.files && inputElement.files[0]) {
      const file = event.target.files[0];

      // TODO Check that file is png or jpg
      if(file){
        getBase64(file, (base64String) => {
          this.image = base64String;
          this.form.get('image')?.setValue(this.image);
        });
      }
    }
  }

  protected resetImage(){
    this.image = '';
    this.form.get('image')?.setValue('');
  }

  /**
   *
   */
  protected onSubmit(){
    this.submitted = true;

    if(!this.form.invalid){
      this.loading = true;

      if(this.isAddMode){
        this.createBook();
      } else {
        this.updateBook();
      }
    }
  }

  // Private methods
  /**
   *
   */
  private createBook(){
    this.booksSubscription = this.bookService.create(this.form.value)
      .subscribe({
        next: () => {
          this.handleSuccessResponse('created');
        },
        error: error => {
          this.handleErrorResponse('created',error);
        }
      })
  }

  private handleErrorResponse(action: string, error: any) {
    Swal.fire('Error', `The book could not be ${action}: ${error.message}` , 'warning');
    this.loading = false;
  }

  private handleSuccessResponse(action: string){
    Swal.fire(`Book ${action}!`,`The book ${this.form.value.title} has been ${action} successfully`,`success`);
    this.router.navigate(['/books']);
  }

  private loadBook() {
    this.booksSubscription = this.bookService.getById(this.id!)
        .subscribe((response) => {
          this.selectedFormat = response.parameters.format.name;
          this.selectedGenre = response.genre.name;

          if(response.image){
            this.image = response.image;
          }

          this.form.patchValue(response);

          this.loading = false;
        });
  }

  private loadFormats() {
    this.bookGenresSubscription = this.bookFormatService.getAll().subscribe(bookFormatList => {
      this.formatTypes = bookFormatList;
    })
  }

  private loadGenres() {
    this.bookFormatsSubscription = this.bookGenreService.getAll().subscribe(bookGenreList => {
      this.genreTypes = bookGenreList;
    });
  }

  /**
   *
   */
  private updateBook(){
    this.booksSubscription = this.bookService.update(this.id!, this.form.value)
      .subscribe({
        next: () => {
          this.handleSuccessResponse('updated');
        },
        error: error => {
          this.handleErrorResponse('updated', error);
        }
      })
  }
}
