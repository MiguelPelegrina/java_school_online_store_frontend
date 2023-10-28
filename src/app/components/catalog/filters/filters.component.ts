import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { BookGenreService } from 'src/app/services/book-genre/book-genre.service';
import { BookGenre } from 'src/app/shared/domain/book/book-genre/book-genre';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit, OnDestroy {
  // Fields
  @Output()
  protected showGenre = new EventEmitter<string>();

  protected bookGenreSubscription?: Subscription;

  protected genres: BookGenre [] = [];

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
    this.showGenre.emit(genre);
  }
}
