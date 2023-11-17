import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BookFormatService } from 'src/app/services/book/format/book-format.service';
import { BookGenreService } from 'src/app/services/book/genre/book-genre.service';
import { BookService } from 'src/app/services/book/book.service';
import { BookFormat } from '../../../shared/domain/book/parameters/book-parameters-format/book-parameters-format';
import { BookGenre } from '../../../shared/domain/book/book-genre/book-genre';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { AbstractForm } from 'src/app/shared/components/abstract-form';
import { getBase64 } from 'src/app/shared/utils/utils';
import { requiredFileType } from 'src/app/shared/utils/required-file-type';

// TODO Document
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
   * Default constructor
   * @param bookService
   * @param bookFormatService
   * @param bookGenreService
   * @param fb
   * @param route
   * @param router
   * @param snackbar
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
  // Public methods
  public ngOnDestroy(): void {
    this.booksSubscription?.unsubscribe();
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
      this.isLoading = false;
    }

    this.loadGenres();

    this.loadFormats();

    // Generate the form
    this.form = this.fb.group({
      // TODO Not sure if right, should I use form?.value instead of empty values?
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
  protected onFileSelected(event: any): void{
    const inputElement: HTMLInputElement = event.target;

    if (inputElement.files && inputElement.files[0]) {
      const file = event.target.files[0];

      if(file && requiredFileType(file)){
        getBase64(file, (base64String) => {
          this.image = base64String;
          this.form.get('image')?.setValue(this.image);
        });
      } else {
        Swal.fire('','','warning');
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
   *
   */
  private createBook(){
    this.booksSubscription = this.bookService.create(this.form.value)
      .subscribe({
        next: () => {
          this.handleSuccessResponse('created');
        },
        error: error => {
          this.handleErrorResponse('created', error);
        }
      })
  }

  private handleErrorResponse(action: string, error: any) {
    Swal.fire('Error', `The book could not be ${action}: ${error.message}` , 'warning');
    this.isLoading = false;
  }

  private handleSuccessResponse(action: string){
    Swal.fire(`Book ${action}!`,`The book ${this.form.value.title} has been ${action} successfully`,`success`);
    this.router.navigate(['/books']);
  }

  private loadBook(): void {
    this.booksSubscription = this.bookService.getById(this.id!).subscribe((response) => {
      this.selectedFormat = response.parameters.format.name;
      this.selectedGenre = response.genre.name;

      if(response.image){
        this.image = response.image;
      }

      this.form.patchValue(response);

      this.isLoading = false;
    });
  }

  private loadFormats(): void {
    this.bookGenresSubscription = this.bookFormatService.getAll().subscribe(bookFormatList => {
      this.formatTypes = bookFormatList;
    })
  }

  private loadGenres(): void {
    this.bookFormatsSubscription = this.bookGenreService.getAll().subscribe(bookGenreList => {
      this.genreTypes = bookGenreList;
    });
  }

  /**
   *
   */
  private updateBook(): void{
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
