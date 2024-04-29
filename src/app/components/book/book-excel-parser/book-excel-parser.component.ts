import { AfterViewInit, Component, ViewChild } from '@angular/core';
import * as XLSX from 'xlsx';
import { allowedParserExtensions, requiredFileType } from 'src/app/shared/utils/required-file-type';
import Swal from 'sweetalert2';
import { BookService } from 'src/app/services/book/book.service';
import { Book } from 'src/app/shared/domain/book/book';
import { ExcelBook } from 'src/app/shared/domain/book/excel-book/excel-book';
import { capitalizeFirstLetter, informUserOfError } from 'src/app/shared/utils/utils';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { StringValues } from 'src/app/shared/utils/string-values';

/**
 * Component for importing and parsing book data from an Excel file.
 */
@Component({
  selector: 'app-book-excel-parser',
  templateUrl: './book-excel-parser.component.html',
  styleUrls: ['./book-excel-parser.component.css', '../../../app.component.css']
})
export class BookExcelParserComponent implements AfterViewInit{
  // Subcomponents
  @ViewChild(MatPaginator)
  protected paginator!: MatPaginator;

  // Fields
  protected columnsToDisplay: string [] = ['title', 'isbn', 'active', 'price', 'stock', 'genre', 'parameters.author', 'parameters.format'];

  protected data: ExcelBook[] = [];

  protected dataSource = new MatTableDataSource<ExcelBook>(this.data);

  protected dataPageSize = StringValues.DEFAULT_PAGE_SIZE;

  protected dataLength = 0;

  protected dataPage = 0;

  protected dataPageSizeOptions: number[] = StringValues.DEFAULT_PAGE_SIZE_OPTIONS;

  protected excelSelected = false;

  protected isLoading = false;

  protected parsedData: Book[] = [];

  protected fileReader = new FileReader();

  /**
   * Constructor
   * @param {BookService} service - The BookService for handling book-related operations.
   */
  constructor(private service: BookService){}

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;

    this.paginator.page.subscribe((event) => {
      this.dataPageSize = event.length;
      this.dataPage = event.pageIndex;
      this.dataPageSize = event.pageSize;
    });
  }

  // Methods
  // Protected methods
  /**
   * Initiates the process of importing and parsing Excel data into books.
   */
  protected importExcel(){

    Swal.fire({
      title: "Possible data loss",
      titleText: "Books which share the same ISBN will be updated, be careful!",
      icon: 'warning',
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: 'Okay',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if(result.isConfirmed){
        this.isLoading = true;

        this.parseExcelBooksToBooks();

        this.service.createAll(this.parsedData).subscribe({
          next: (response) => {
            this.isLoading = false;
            Swal.fire('Books created/updated!','All books where created/updated successfully!','success');
            console.log(response);
          },
          error: (error) => {
            this.isLoading = false;
            informUserOfError(error);
          }}
        );
      }
    });
  }

  /**
   * Reads and processes the selected Excel file when the user selects a file.
   * @param event - The file input change event containing the selected file.
   */
  protected readExcel(event: any){
    const inputElement: HTMLInputElement = event.target;

    if (inputElement.files && inputElement.files[0]) {
      const file = event.target.files[0];

      if(file && requiredFileType(file, allowedParserExtensions)){
        this.isLoading = true;

        this.fileReader.readAsBinaryString(file);

        this.fileReader.onload = (e) => {
          this.parsedData = [];

          this.excelSelected = true;

          this.readExcelWorkBook();

          this.dataSource.data = this.data;

          this.isLoading = false;
        }
      } else {
        Swal.fire('Wrong format type',`The file needs to be in one of the following types: ${allowedParserExtensions}`,'warning');

        event.target.value = null;

        this.excelSelected = false;

        this.data = [];
      }
    }
  }

  /**
   * Reads an Excel workbook and extracts data from all its sheets into a single array.
   * This method is useful for processing Excel files in web applications where data from multiple sheets needs to be combined or displayed together.
   */
  private readExcelWorkBook() {
    const workBook = XLSX.read(this.fileReader.result, {type:'binary'});

    const sheetNames = workBook.SheetNames;

    for (let index = 0; index < sheetNames.length; index++) {
      const sheetName = sheetNames[index];
      const sheet = workBook.Sheets[sheetName]
      this.data = this.data.concat(XLSX.utils.sheet_to_json(sheet));
    }
  }

  /**
   * Parses each Excel book entry into a Book and populates the parsedData array.
   */
  private parseExcelBooksToBooks(): void {
    this.data.forEach((excelBook) =>
      this.parsedData.push(this.parseExcelBookToBook(excelBook))
    );
  }

  /**
   * Converts a single Excel book entry into a Book object.
   *
   * @param excelBook - The ExcelBook object to be converted.
   * @returns - The corresponding Book object.
   */
  private parseExcelBookToBook(excelBook: ExcelBook): Book {
    const book: Book = {
      id: 0,
      title: excelBook.Title,
      price: excelBook.Price,
      isbn: excelBook.ISBN,
      genre: {
        name: capitalizeFirstLetter(excelBook.Genre)
      },
      stock: excelBook.Stock,
      active: excelBook.Active,
      image: '',
      parameters: {
        id: 0,
        author: excelBook.Author,
        format: {
          name: capitalizeFirstLetter(excelBook.Format),
        },
        active: excelBook.Active,
      },
    };

    return book;
  }
}
