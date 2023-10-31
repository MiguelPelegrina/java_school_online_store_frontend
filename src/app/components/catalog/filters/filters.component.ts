import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatListOption, MatSelectionList } from '@angular/material/list';
import { Subscription } from 'rxjs';
import { BookGenreService } from 'src/app/services/book/genre/book-genre.service';
import { BookGenre } from 'src/app/shared/domain/book/book-genre/book-genre';

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

  constructor(private service: BookGenreService) {}

  /**
   * A lifecycle hook that is called when a directive, pipe, or service is destroyed. Used for any custom cleanup that needs to occur when the instance is destroyed.
   */
  public ngOnDestroy(): void {
    this.bookGenreSubscription?.unsubscribe();
  }

  /**
   * A lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   * Fills the collection with data from the database
   */
  public ngOnInit(): void {
    this.bookGenreSubscription = this.service.getAll().subscribe(response => {
      this.genres = response;
    })
  }

  protected onShowGenre(genre: string): void {
    if(this.genre === genre){
      this.genre = '';
      this.matSelect._items.forEach((data: MatListOption) => data._setSelected(false));
    } else {
      this.genre = genre
    }

    this.showGenre.next(this.genre);
  }

  protected resetGenre(){
    this.matSelect._items.forEach((data: MatListOption) => data._setSelected(false));
    // TODO Not sure about this
    this.showGenre.next('');
  }
}
