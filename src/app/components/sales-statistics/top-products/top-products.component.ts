import { AfterViewInit, Component } from '@angular/core';
import { Book } from 'src/app/shared/domain/book/book';
import { BookService } from 'src/app/services/book/book.service';
import { Observable } from 'rxjs';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-top-products',
  templateUrl: './top-products.component.html',
  styleUrls: ['./top-products.component.css', '../../../app.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed, void', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
      transition('expanded <=> void', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ]),
  ],
})
export class TopProductsComponent implements AfterViewInit {
  //Fields
  protected columnsToDisplay: string [] = ['title', 'parameters.author', 'active', 'price', 'stock', 'actions'];

  protected data: Book[] = [];

  protected data$ = new Observable<Book[]>();

  protected expandedElement?: Book;

  protected isLoading = true;

  constructor(private bookService: BookService){}

  public ngAfterViewInit(): void {
    this.loadTopProducts();
  }

  private loadTopProducts(){
    this.bookService.getTopProducts(10).subscribe((response) => {
      this.data = response;
      this.isLoading = false;
    })
  }

}
