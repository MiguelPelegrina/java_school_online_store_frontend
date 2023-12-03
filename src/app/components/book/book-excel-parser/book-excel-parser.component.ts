import { Component } from '@angular/core';
import * as XLSX from 'xlsx';
import { allowedParserExtensions, requiredFileType } from 'src/app/shared/utils/required-file-type';
import Swal from 'sweetalert2';
import { BookService } from 'src/app/services/book/book.service';
import { Book } from 'src/app/shared/domain/book/book';
import { ExcelBook } from 'src/app/shared/domain/book/excel-book/excel-book';
import { informUserOfError } from 'src/app/shared/utils/utils';

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

  // Constructor
  constructor(private service: BookService){}

  // Methods
  // Protected methods
  protected importExcel(){
    this.parseExcelBooksToBooks();
    this.service.createAll(this.parsedData).subscribe(
      {next: () => {
        Swal.fire('Books imported!','All books where imported successfully!','success');
      },
      error: (error) => {
        informUserOfError(error);
      }}
    );
  }

  protected readExcel(event: any){
    const inputElement: HTMLInputElement = event.target;

    if (inputElement.files && inputElement.files[0]) {
      const file = event.target.files[0];

      if(file && requiredFileType(file, allowedParserExtensions)){
        let fileReader = new FileReader();

        fileReader.readAsBinaryString(file);

        fileReader.onload = (e) => {
          this.excelSelected = true;

          const workBook = XLSX.read(fileReader.result, {type:'binary'});

          const sheetNames = workBook.SheetNames;

          this.data = XLSX.utils.sheet_to_json(workBook.Sheets[sheetNames[0]]);

          console.log(this.data);
        }
      } else {
        Swal.fire('Wrong format type',`The file needs to be in one of the following types: ${allowedParserExtensions}`,'warning');
        // TODO Reset chosen file
      }
    }
  }

  private parseExcelBooksToBooks(): void {
    this.data.forEach((excelBook) =>
      this.parsedData.push(this.parseExcelBookToBook(excelBook))
    );
  }

  private parseExcelBookToBook(excelBook: ExcelBook): Book {
    console.log(excelBook);

    const book: Book = {
      id: 0,
      title: excelBook.Title,
      price: excelBook.Price,
      isbn: excelBook.ISBN,
      genre: {
        name: excelBook.Genre
      },
      stock: excelBook.Stock,
      active: excelBook.Active,
      image: '',
      parameters: {
        id: 0,
        author: excelBook.Author,
        format: {
          name: excelBook.Format,
        },
        active: excelBook.Active,
      },
    };

    console.log(book)
    return book;
  }
}
