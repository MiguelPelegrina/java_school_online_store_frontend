import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { BookGenreService } from 'src/app/services/book/genre/book-genre.service';
import { BookGenre } from 'src/app/shared/domain/book/book-genre/book-genre';
import Swal from 'sweetalert2';

// TODO Optimize to paginate manually like catalog
/**
 * Component that shows a table with all book genres.
 */
@Component({
  selector: 'app-list-book-genre',
  templateUrl: './list-book-genre.component.html',
  styleUrls: ['./list-book-genre.component.css']
})
export class ListBookGenreComponent implements OnInit, OnDestroy{
  // Subcomponents
  @ViewChild(MatPaginator)
  protected paginator!: MatPaginator;

  @ViewChild(MatSort)
  protected sort!: MatSort;

  // Fields
  protected bookGenres: BookGenre[] = [];

  protected bookGenreDatasource = new MatTableDataSource<BookGenre>(this.bookGenres);

  protected bookGenreSubscription?: Subscription;

  protected displayedColumnsOfBookGenres: string[] = ['genre', 'actions'];

  protected isLoading = true;

  // Constructor
  /**
   * Constructor of the component.
   * @param bookGenreService - Service that gets all the book genres
   */
  constructor(private bookGenreService: BookGenreService){}

  // Methods
  // Lifecycle hooks
  /**
   * A lifecycle hook that is called after Angular has fully initialized a component's view.
   * Assigns the Paginator and the Sort components to the respective properties of the book genres datasource to handle pages and sorting of the table.
  */
  public ngAfterViewInit(){
    this.bookGenreDatasource.paginator = this.paginator;
    this.bookGenreDatasource.sort = this.sort;
  }

  /**
   * A lifecycle hook that is called when a directive, pipe, or service is destroyed. Used for any custom cleanup that needs to occur when the instance is destroyed.
   */
  public ngOnDestroy(): void {
    this.bookGenreSubscription?.unsubscribe();
  }

  /**
   * A lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   * Fills the table with data from the database and sets the filter of the searchbar to search by book genre name.
   */
  public ngOnInit(): void {
    this.getAllBookGenres();
  }

  // Protected methods
  /**
   * Opens a modal dialog to create a new Genre
   */
  protected addGenre(){
    this.createAddBookGenreDialog();
  }

  /**
   * Filters the data of the table with the value of the input of the search bar.
   * @param filter - Value of the input field
   */
  protected applyFilter(filter: string){
    this.bookGenreDatasource.filter = filter.trim().toLowerCase();
  }

  /**
   * Deletes a book genre after confirming with the user.
   * @param name - Name of the book genre to be deleted.
   */
  protected deleteBookGenre(name: string){
    Swal.fire({
      title: `Do you really want to delete ${name}?`,
      icon: 'warning',
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if(result.isConfirmed){
        this.bookGenreService.delete(name).subscribe({
          complete: () => {
            this.getAllBookGenres();
            Swal.fire('Delete successful', '', 'success');
          },
          error: () => Swal.fire('An error ocurred. You cannot delete a format that is used by a book.', '', 'warning')
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Changes are not saved', '', 'info');
      }
    })
  }

  // Private methods
  /**
   * Opens a modal dialog to add a new book genre.
   */
  private createAddBookGenreDialog(){
    Swal.fire({
      title: 'Add a new genre',
      html: `<input type="text" id="genre_name" class="swal2-input" placeholder="Name">`,
      confirmButtonText: 'Accept',
      focusConfirm: false,
      preConfirm: () => {
        const bookGenreName = (Swal.getPopup()?.querySelector('#genre_name') as HTMLInputElement).value;

        const bookGenre = {name: bookGenreName}

        this.checkValidGenre(bookGenre);

        return bookGenre;
      }
    }).then((result) => {
      this.bookGenreService.create(result.value).subscribe({
        complete: () => {
          this.getAllBookGenres();
          this.isLoading  = false;
          Swal.fire('Genre added',`The book genre ${result.value.name} has been added successfully`,`success`);
        },
        error: () => {
          this.isLoading  = false;
          Swal.fire('Error',`The book genre ${result.value.name} could not be created`,`warning`);
        }
      })
    })
  }

  /**
   * Checks if the entered book genre is valid.
   * @param bookGenre - The book genre to be validated
   */
  private checkValidGenre(bookGenre: BookGenre){
    if (!bookGenre.name) {
      Swal.showValidationMessage(`Please enter a valid genre`)
    }

    const bookGenreNames = this.bookGenres.map(genre => {
      return genre.name;
    })

    if(bookGenreNames.includes(bookGenre.name)){
      Swal.showValidationMessage(`${bookGenre.name} already exists.`)
    }
  }

  /**
   * Retrieves all book genres from the database, sorts them alphabetically, and updates the component's data.
   */
  private getAllBookGenres(){
    this.bookGenreSubscription = this.bookGenreService.getAll().subscribe(bookGenreList => {
      this.sortBookGenreListByName(bookGenreList);

      this.bookGenres = bookGenreList;

      this.bookGenreDatasource.data = this.bookGenres;

      this.isLoading = false;
    });
  }

  /**
   *The book list is sorted by the activity first and then by the title of the book
   * @param bookList - Book list that will be sorted.
   * @returns The sorted book list.
   */
   private sortBookGenreListByName(bookList: BookGenre[]): BookGenre[] {
    return bookList.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
  }
}
