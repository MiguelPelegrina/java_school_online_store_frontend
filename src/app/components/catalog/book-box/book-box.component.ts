import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Book } from 'src/app/shared/domain/book/book';

@Component({
  selector: 'app-book-box',
  templateUrl: './book-box.component.html',
  styleUrls: ['./book-box.component.css']
})
export class BookBoxComponent {
  @Input()
  public fullWidthMode = false;

  @Input()
  public book?: Book;

  @Output()
  private addToCart = new EventEmitter();

  public onAddToCart(): void{
    this.addToCart.emit(this.book);
  }
}
