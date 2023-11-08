import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { OrderService } from 'src/app/services/order/order.service';
import { Order } from 'src/app/shared/domain/order/order';

// TODO
// - Optimize to paginate manually like catalog
@Component({
  selector: 'app-list-order',
  templateUrl: './list-order.component.html',
  styleUrls: ['./list-order.component.css', '../../../app.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ListOrderComponent implements OnDestroy, OnInit {
  // Subcomponents
  @ViewChild(MatPaginator)
  protected paginator!: MatPaginator;

  @ViewChild(MatSort)
  protected sort!: MatSort;

  // Fields
  protected allowOrderStatusUpdates = true;

  protected columnsToDisplay = ['user', 'deliveryMethod', 'orderStatus', 'paymentMethod', 'paymentStatus', 'date', 'expand'];

  protected data: Order[] = [];

  protected dataSource = new MatTableDataSource<Order>(this.data);

  protected expandedElement?: Order | null;

  protected isLoading = true;

  private orderSubscription?: Subscription;

  constructor(private orderService: OrderService, private snackbar: MatSnackBar) {}

  /**
   * A lifecycle hook that is called after Angular has fully initialized a component's view.
   * Assigns the Paginator and the Sort components to the respective properties of the datasource to handle pages and sorting of the table.
   */
  public ngAfterViewInit(){
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // TODO Might need to assign it after every data change
    // this.dataSource.sortingDataAccessor = (item, property) => {
    //   switch(property) {
    //     case 'parameters.author': return item.parameters.author;
    //     default: return (item as IIndexable<Book>)[property];
    //   }
    // }
  }

  /**
   * A lifecycle hook that is called when a directive, pipe, or service is destroyed. Used for any custom cleanup that needs to occur when the instance is destroyed.
  */
 public ngOnDestroy(): void {
   this.orderSubscription?.unsubscribe();
  }

  /**
   * A lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   * Fills the table with data from the database and sets the filter of the searchbar
   */
  public ngOnInit(): void {
    this.getAllOrders();
  }

  /**
   * Filters the data of the table with the value of the input of the search bar.
   * @param filter - Value of the input field
   */
  protected applyFilter(filter: string){
    this.dataSource.filter = filter.trim().toLowerCase();
  }

  protected getTotal(): number | undefined{
    return this.expandedElement?.orderedBooks.map((orderedBook) => orderedBook.amount * orderedBook.book.price).reduce((prev, current) => prev + current, 0);
  }

  /**
   * Retrieves all elements from the database. Hides the progress bar when the data is loaded.
   */
  private getAllOrders(){
    this.orderSubscription = this.orderService.getAll().subscribe({
      next: (response) => {
        this.data = response.content;

        this.dataSource.data = response.content;

        this.isLoading = false;
      }
    })
  }
}
