import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { Book } from 'src/app/shared/domain/book/book';
import { BookService } from 'src/app/services/book/book.service';
import { Observable, Subscription } from 'rxjs';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { informUserOfError } from 'src/app/shared/utils/utils';
import { ANIMATION_DURATION } from 'src/app/shared/utils/string-values';

/**
 * Component for displaying top products.
 */
@Component({
  selector: 'app-top-products',
  templateUrl: './top-products.component.html',
  styleUrls: ['./top-products.component.css', '../../../app.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed, void', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate(ANIMATION_DURATION)),
      transition('expanded <=> void', animate(ANIMATION_DURATION))
    ]),
  ],
})
export class TopProductsComponent implements AfterViewInit, OnDestroy {
  //Fields
  protected bookSubscription?: Subscription;

  protected columnsToDisplay: string [] = ['amount', 'title', 'parameters.author', 'active', 'price', 'stock', 'actions'];

  protected data: Book[] = [];

  protected data$?: Observable<Book[]>;

  protected expandedElement?: Book;

  protected isLoading = true;

  /**
   * Constructor
   * @param bookService The service for managing book-related operations.
   */
  constructor(private bookService: BookService){}

  // Methods
  // Lifecycle hooks
  /**
   * A lifecycle hook that is called when a directive, pipe, or service is destroyed. Used for any custom cleanup that needs to occur when the instance is destroyed.
   */
  public ngOnDestroy(): void {
    this.bookSubscription?.unsubscribe();
  }

  /**
   * A lifecycle hook that is called after Angular has fully initialized a component's view.
   * Loads top products from the book service.
   */
  public ngAfterViewInit(): void {
    this.loadTopProducts();
  }

  /**
   * Loads top products from the book service.
   * Updates the data array and sets isLoading to false once the data is loaded.
   */
  private loadTopProducts(){
    this.bookSubscription = this.bookService.getTopProducts(10).subscribe({
      next: (response) => {
        this.data = response;
        this.isLoading = false;
      },
      error: (error: any) => {
        informUserOfError(error);
        this.isLoading = false;
      }
    })
  }
}
