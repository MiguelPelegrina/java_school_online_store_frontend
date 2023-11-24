import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatListOption, MatSelectionList } from '@angular/material/list';
import { Subscription } from 'rxjs';
import { BookGenreService } from 'src/app/services/book/genre/book-genre.service';
import { BookGenre } from 'src/app/shared/domain/book/book-genre/book-genre';

/**
 * Angular component representing a set of filters for book genres.
 * This component provides a list of genres that users can select to filter books based on genre.
 */
@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit, OnDestroy {
  // Subcomponents
  @ViewChild(MatSelectionList)
  protected matSelect!: MatSelectionList;

  // Fields
  @Output()
  protected showGenre = new EventEmitter<string>();

  protected bookGenreSubscription?: Subscription;

  protected genres: BookGenre [] = [];

  private genre: string = '';

  /**
   * Constructor of the component.
   * @param service - Service for managing book genres
   */
  constructor(private service: BookGenreService) {}

  /**
   * A lifecycle hook that is called when a directive, pipe, or service is destroyed. Used for any custom cleanup that needs to occur when the instance is destroyed.
   */
  public ngOnDestroy(): void {
    this.bookGenreSubscription?.unsubscribe();
  }

  /**
   * A lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   * Fills the collection with data from the database.
   */
  public ngOnInit(): void {
    this.bookGenreSubscription = this.service.getAll().subscribe(response => {
      this.genres = response;
    })
  }

  /**
   * Event handler for when a genre is selected or deselected.
   * Emits the selected genre through the `showGenre` event.
   * @param genre - The selected genre
   */
  protected onShowGenre(genre: string): void {
    if(this.genre === genre){
      this.genre = '';
      this.matSelect._items.forEach((data: MatListOption) => data._setSelected(false));
    } else {
      this.genre = genre
    }

    this.showGenre.next(this.genre);
  }

  /**
   * Resets the selected genre and emits an event with an empty string to indicate no genre filtering.
   */
  protected resetGenre(){
    this.matSelect._items.forEach((data: MatListOption) => data._setSelected(false));
    this.showGenre.next('');
  }
}
