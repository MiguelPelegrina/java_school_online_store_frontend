import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BookGenreService } from 'src/app/services/book-genre/book-genre.service';
import { BookGenre } from 'src/app/shared/domain/book/book-genre/book-genre';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit {
  // Fields
  @Output()
  protected showGenre = new EventEmitter<string>();

  protected genres: BookGenre [] = [];

  constructor(private service: BookGenreService) {}

  public ngOnInit(): void {
    this.service.getAll().subscribe(response => {
      this.genres = response;
    })
  }

  protected onShowGenre(genre: string): void {
    this.showGenre.emit(genre);
  }
}
