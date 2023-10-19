import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { BookFormatService } from 'src/app/services/book-format/book-format.service';
import { BookGenreService } from 'src/app/services/book-genre/book-genre.service';
import { BookService } from 'src/app/services/book/book.service';
import { BookParametersFormat } from '../../../shared/domain/book/parameters/book-parameters-format/book-parameters-format';
import { BookGenre } from '../../../shared/domain/book/book-genre/book-genre';
import { ImageSelectorComponent } from '../../../shared/components/image-selector/image-selector.component';
import { getBase64 } from 'src/app/shared/utils/utils';
import { requiredFileType } from 'src/app/shared/utils/required-file-type';

@Component({
  selector: 'app-add-edit-book-form',
  templateUrl: './add-edit-book-form.component.html',
  styleUrls: ['./add-edit-book-form.component.css']
})
export class AddEditBookFormComponent implements OnInit{
  // Subcomponents
  // TODO Save image with the book
  // Not sure if right
  @ViewChild(ImageSelectorComponent)
  protected imageSelector!: ImageSelectorComponent;

  // Fields
  protected image: string | ArrayBuffer | null = '';

  protected form!: FormGroup;

  protected formatTypes: BookParametersFormat[] = []

  protected genreTypes: BookGenre[] = []

  protected id?: number;

  protected isAddMode?: boolean;

  protected loading = false;

  protected submitted = false;

  protected selectedGenre: string = '';

  protected selectedFormat: string = '';

  // Constructor
  /**
   *
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
    private snackbar: MatSnackBar
  ) {}

  // Methods
  // Public methods
  /**
   *
   */
  public ngOnInit(): void {
    // Get the book id
    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;

    this.bookGenreService.getAll().subscribe(bookGenreList => {
      this.genreTypes = bookGenreList;
    });
    this.bookFormatService.getAll().subscribe(bookFormatList => {
      this.formatTypes = bookFormatList;
    })

    // Generate the form
    this.form = this.formBuilder.group({
      // TODO Not sure if right, should I use form?.value instead of empty values?
      active: [false, Validators.required],
      id: [''],
      image: ['', Validators.required],
      // TODO Validators.required does not work with image
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

    if(this.id
      // && !this.isAddMode
      ){
      this.bookService.getById(this.id)
        .subscribe((response) => {
          this.selectedFormat = response.parameters.format.name;
          this.selectedGenre = response.genre.name;

          this.image = response.image;

          this.form.patchValue(response)
        });
    }
  }

  // Protected methods
  /**
   * Gets access to form fields
   */
  protected get f(){
    return this.form.controls;
  }

  protected onFileSelected(event: any): void{
    const inputElement: HTMLInputElement = event.target;

    if (inputElement.files && inputElement.files[0]) {
      const file = event.target.files[0];

      if(file){
        getBase64(file, (base64String) => {
          this.image = base64String;
          this.form.get('image')?.setValue(this.image);
        });
      }
    }
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
    this.bookService.create(this.form.value)
      .subscribe({
        next: () => {
          this.snackbar.open('Book successfully created!');
          this.router.navigate(['../'], { relativeTo: this.route });
        },
        error: error => {
          this.snackbar.open(`Book could not be created. Error: ${error}`);
          this.loading = false;
      }
      })
  }

  /**
   *
   */
  private updateBook(){
    this.bookService.update(this.id!, this.form.value)
      .subscribe({
        next: () => {
          this.snackbar.open('Book updated successfully!');
          this.router.navigate(['/books']);
        },
        error: error => {
          this.snackbar.open(`Book could not be updated. Error: ${error}`);
          this.loading = false;
        }
      })
  }
}
