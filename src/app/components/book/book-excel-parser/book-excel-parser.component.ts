import { Component } from '@angular/core';
import * as XLSX from 'xlsx';
import { allowedParserExtensions, requiredFileType } from 'src/app/shared/utils/required-file-type';
import Swal from 'sweetalert2';
import { BookService } from 'src/app/services/book/book.service';
import { Book } from 'src/app/shared/domain/book/book';
import { ExcelBook } from 'src/app/shared/domain/book/excel-book/excel-book';
import { capitalizeFirstLetter, informUserOfError } from 'src/app/shared/utils/utils';

/**
 * Component for importing and parsing book data from an Excel file.
 */
@Component({
  selector: 'app-book-excel-parser',
  templateUrl: './book-excel-parser.component.html',
  styleUrls: ['./book-excel-parser.component.css']
})
export class BookExcelParserComponent {
  // Fields
  protected columnsToDisplay: string [] = ['title', 'active', 'price', 'stock', 'genre', 'parameters.author', 'parameters.format'];

  protected data: ExcelBook[] = [];

  protected excelSelected = false;

  protected isLoading = false;

  protected parsedData: Book[] = [];

  /**
   * Constructor
   * @param {BookService} service - The BookService for handling book-related operations.
   */
  constructor(private service: BookService){}

  // Methods
  // Protected methods
  /**
   * Initiates the process of importing and parsing Excel data into books.
   */
  protected importExcel(){
    this.isLoading = true;
    this.parseExcelBooksToBooks();
    this.service.createAll(this.parsedData).subscribe({
      next: (response) => {
        this.isLoading = false;
        Swal.fire('Books imported!','All books where imported successfully!','success');
        console.log(response);
      },
      error: (error) => {
        this.isLoading = false;
        informUserOfError(error);
      }}
    );
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
        let fileReader = new FileReader();

        this.isLoading = true;

        fileReader.readAsBinaryString(file);

        fileReader.onload = (e) => {
          this.excelSelected = true;

          const workBook = XLSX.read(fileReader.result, {type:'binary'});

          const sheetNames = workBook.SheetNames;

          this.data = XLSX.utils.sheet_to_json(workBook.Sheets[sheetNames[0]]);

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
    // TODO Image?
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
