import { Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * Search bar component. Contains an input for the user to write the filter, a 'search' button to apply the filter and a 'clear' button to reset the input field
 */
@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent {
  // Fields
  @Input()
  placeholder: string = '';

  @Output()
  searchEvent = new EventEmitter<string>();

  @Output()
  setFilterEvent = new EventEmitter<string>();

  protected value: string = '';

  // Methods
  public searchItem(value: string){
    this.searchEvent.emit(value);
  }

  public setFilter(value: string){
    this.setFilterEvent.emit(value);
  }
}
