import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BookGenreService } from 'src/app/services/book-genre/book-genre.service';
import { BookGenre } from 'src/app/shared/domain/book/book-genre/book-genre';
import Swal from 'sweetalert2';

// TODO Try to abstract and use with book parameters format
// TODO Should try to abstract table as well
@Component({
  selector: 'app-list-book-genre',
  templateUrl: './list-book-genre.component.html',
  styleUrls: ['./list-book-genre.component.css']
})
export class ListBookGenreComponent implements OnInit{
  // Subcomponents
  @ViewChild(MatPaginator)
  protected paginator!: MatPaginator;

  @ViewChild(MatSort)
  protected sort!: MatSort;

  // Fields
  protected bookGenres: BookGenre[] = [];

  protected bookGenreDatasource = new MatTableDataSource<BookGenre>(this.bookGenres);

  protected displayedColumnsOfBookGenres: string[] = ['genre', 'actions'];

  protected isLoading: boolean = true;

  // Constructor
  /**
   * Constructor of the component.
   * @param bookGenreService - Service that gets all the book genres
   */
  constructor(
    private bookGenreService: BookGenreService,
  ){}

  // Methods
  // Public methods
  /**
   * A lifecycle hook that is called after Angular has fully initialized a component's view.
   * Assigns the Paginator and the Sort components to the respective properties of the book genres datasource to handle pages and sorting of the table.
   */
  public ngAfterViewInit(){
    this.bookGenreDatasource.paginator = this.paginator;
    this.bookGenreDatasource.sort = this.sort;
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
   * Runs on every keyup inside the searchbar. Obtains the inserted value and filters the table by it.
   * If the value is 'the' all books with the title or author containg 'the' are shown.
   */
  protected applyFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;

    this.bookGenreDatasource.filter = filterValue.trim().toLowerCase();
  }

  protected deleteBookGenre(name: string){
    // TODO Check for consent first
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
          // TODO When an employee tries to delete a genre if it is used by any book. Not sure how to handle :
          // - Simply don't allow it.
          // - Add Id as identifier and allow to change names -> requires changing database
          error: () => Swal.fire('An error ocurred, contact your support', '', 'warning')
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Changes are not saved', '', 'info');
      }
    })
  }

  // Private methods
  // TODO Refactor into smaller methods
  private createAddBookGenreDialog(){
    Swal.fire({
      title: 'Add a new genre',
      html: `<input type="text" id="genre_name" class="swal2-input" placeholder="Name">`,
      confirmButtonText: 'Accept',
      focusConfirm: false,
      preConfirm: () => {
        const bookGenreName = (Swal.getPopup()?.querySelector('#genre_name') as HTMLInputElement).value;

        const bookGenre = {name: bookGenreName}

        // TODO Check if the genre already exists
        if (!bookGenre.name) {
          Swal.showValidationMessage(`Please enter a valid name`)
        }

        const bookGenreNames = this.bookGenres.map(genre => {
          return genre.name;
        })

        if(bookGenreNames.includes(bookGenreName)){
          Swal.showValidationMessage(`${bookGenreName} already exists.`)
        }

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
   * Retrieves all books from the database and sorts them by 'active' first and then alphabetically by book 'title' (A-Z). Hides the progress bar when the data is loaded.
   */
  private getAllBookGenres(){
    this.bookGenreService.getAll().subscribe(bookGenreList => {
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
