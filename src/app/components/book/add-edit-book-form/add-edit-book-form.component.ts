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

@Component({
  selector: 'app-add-edit-book-form',
  templateUrl: './add-edit-book-form.component.html',
  styleUrls: ['./add-edit-book-form.component.css']
})
export class AddEditBookFormComponent implements OnInit{
  // Fields
  // Not sure if right
  @ViewChild(ImageSelectorComponent)
  protected imageSelector?: ImageSelectorComponent;
  protected form!: FormGroup;
  protected formatTypes: BookParametersFormat[] = []
  protected genreTypes: BookGenre[] = []
  protected id?: number;
  protected isAddMode?: boolean;
  protected loading = false;
  protected submitted = false;

  // Constructor
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
      active: [false, Validators.required],
      id: [''],
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
      // image?
    })

    if(this.id
      // && !this.isAddMode
      ){
      this.bookService.getById(this.id)
        .subscribe((response) => {
          // TODO I should not be force to enter this manually
          this.form.patchValue(response)
        });
    }
  }

  // Protected methods
  // convenience getter for easy access to form fields
  protected get f(){
    return this.form.controls;
  }

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
