import { Component, EventEmitter, Output } from '@angular/core';

/**
 * Component of the catalog header. Responsible for handling and emiting changes to sorting and shown column count.
 */
@Component({
  selector: 'app-books-header',
  templateUrl: './books-header.component.html',
  styleUrls: ['./books-header.component.css']
})
export class BooksHeaderComponent{
  // Fields
  @Output()
  columnsCountChange = new EventEmitter<number>();

  @Output()
  sortChange = new EventEmitter<string>();

  protected sort = 'desc';

  // Methods
  // Protected methods
  /**
   * Event handler for updating the number of columns. Emits the updated number of columns to the parent component.
   * @param colsNum - The new number of columns.
   */
  protected onColumnsUpdated(colsNum: number): void{
    this.columnsCountChange.emit(colsNum);
  }

  /**
   * Event handler for updating the sorting order. Updates the 'sort' property and emits the new sorting order to the parent component.
   * @param newSort - The new sorting order ('asc' or 'desc').
   */
  protected onSortUpdated(newSort: string): void{
    this.sort = newSort;
    this.sortChange.emit(newSort);
  }
}
