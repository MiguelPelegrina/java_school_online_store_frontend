import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { BookFormatService } from 'src/app/services/book/format/book-format.service';
import { BookFormat } from 'src/app/shared/domain/book/parameters/book-parameters-format/book-parameters-format';
import Swal from 'sweetalert2';

// TODO Optimize to paginate manually like catalog
@Component({
  selector: 'app-list-book-parameters-format',
  templateUrl: './list-book-parameters-format.component.html',
  styleUrls: ['./list-book-parameters-format.component.css']
})
export class ListBookParametersFormatComponent implements OnInit, OnDestroy {
  // Subcomponents
  @ViewChild(MatPaginator)
  protected paginator!: MatPaginator;

  @ViewChild(MatSort)
  protected sort!: MatSort;

   // Fields
  protected bookFormats: BookFormat[] = [];

  protected bookFormatDatasource = new MatTableDataSource<BookFormat>(this.bookFormats);

  protected bookFormatSubscription?: Subscription ;

  protected displayedColumnsOfBookFormats: string[] = ['format', 'actions'];

  protected isLoading: boolean = true;

  // Constructor
  /**
   * Constructor of the component.
   * @param bookFormatService - Service that gets all the book ParametersFormats
   */
  constructor(
    private bookFormatService: BookFormatService,
  ){}


  // Methods
  // Public methods
  /**
   * A lifecycle hook that is called after Angular has fully initialized a component's view.
   * Assigns the Paginator and the Sort components to the respective properties of the book formats datasource to handle pages and sorting of the table.
  */
  public ngAfterViewInit(){
   this.bookFormatDatasource.paginator = this.paginator;
   this.bookFormatDatasource.sort = this.sort;
  }

  /**
   * A lifecycle hook that is called when a directive, pipe, or service is destroyed. Used for any custom cleanup that needs to occur when the instance is destroyed.
   */
  public ngOnDestroy(): void {
    this.bookFormatSubscription?.unsubscribe();
  }

  /**
   * A lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   * Fills the table with data from the database and sets the filter of the searchbar to search by book format name.
  */
 public ngOnInit(): void {
   this.getAllBookFormats();
  }

  // Protected methods
  /**
   * Opens a modal dialog to create a new Format
   */
  protected addFormat(){
    this.createAddBookFormatDialog();
  }

  /**
   * Filters the data of the table with the value of the input of the search bar.
   * @param filter - Value of the input field
   */
  protected applyFilter(filter: string){
    this.bookFormatDatasource.filter = filter.trim().toLowerCase();
  }

  protected deleteBookFormat(name: string){
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
        this.bookFormatService.delete(name).subscribe({
          complete: () => {
            this.getAllBookFormats();
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
  private createAddBookFormatDialog(){
    Swal.fire({
      title: 'Add a new format',
      html: `<input type="text" id="format_name" class="swal2-input" placeholder="Name">`,
      confirmButtonText: 'Accept',
      focusConfirm: false,
      preConfirm: () => {
        const bookFormatName = (Swal.getPopup()?.querySelector('#format_name') as HTMLInputElement).value;

        const bookFormat = {name: bookFormatName}

        this.checkValidFormat(bookFormat);

        return bookFormat;
      }
    }).then((result) => {
      this.bookFormatService.create(result.value).subscribe({
        complete: () => {
          this.getAllBookFormats();
          this.isLoading  = false;
          Swal.fire('Format added',`The book format ${result.value.name} has been added successfully`,`success`);
        },
        error: () => {
          this.isLoading  = false;
          Swal.fire('Error',`The book format ${result.value.name} could not be created`,`warning`);
        }
      })
    })
  }

  private checkValidFormat(bookFormat: BookFormat){
    if (!bookFormat.name) {
      Swal.showValidationMessage(`Please enter a valid format`)
    }

    const bookFormatNames = this.bookFormats.map(format => {
      return format.name;
    })

    if(bookFormatNames.includes(bookFormat.name)){
      Swal.showValidationMessage(`${bookFormat.name} already exists.`)
    }
  }

  /**
   * Retrieves all books from the database and sorts them by 'active' first and then alphabetically by book 'title' (A-Z). Hides the progress bar when the data is loaded.
   */
  private getAllBookFormats(){
    this.bookFormatSubscription = this.bookFormatService.getAll().subscribe(bookFormatList => {
      this.sortBookFormatListByName(bookFormatList);

      this.bookFormats = bookFormatList;

      this.bookFormatDatasource.data = this.bookFormats;

      this.isLoading = false;
    });
  }

  /**
   *The book list is sorted by the activity first and then by the title of the book
   * @param bookList - Book list that will be sorted.
   * @returns The sorted book list.
   */
   private sortBookFormatListByName(bookList: BookFormat[]): BookFormat[] {
    return bookList.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
  }
}
