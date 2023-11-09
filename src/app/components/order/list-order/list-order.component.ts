import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { OrderStatusService } from 'src/app/services/order/order-status/order-status.service';
import { OrderService } from 'src/app/services/order/order.service';
import { Order } from 'src/app/shared/domain/order/order';
import { OrderStatus } from 'src/app/shared/domain/order/order-status/order-status';
import { isAdmin, isClient, isEmployee } from 'src/app/shared/utils/utils';

// TODO
// - Optimize to paginate manually like catalog
@Component({
  selector: 'app-list-order',
  templateUrl: './list-order.component.html',
  styleUrls: ['./list-order.component.css', '../../../app.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed, void', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
      transition('expanded <=> void', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
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

  protected data?: Order[];

  protected dataSource = new MatTableDataSource<Order>(this.data);

  protected expandedElement?: Order | null;

  protected isClient: boolean;

  protected isLoading = true;

  protected orderStatuses: OrderStatus[] = [];

  private orderSubscription?: Subscription;

  private previousOrderStatus?: OrderStatus;

  private orderStatusSubscription?: Subscription;

  constructor(private orderService: OrderService, private orderStatusService: OrderStatusService, private snackbar: MatSnackBar) {
    this.isClient = isClient();
  }

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
   this.orderStatusSubscription?.unsubscribe();
  }

  /**
   * A lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   * Fills the table with data from the database and sets the filter of the searchbar
   */
  public ngOnInit(): void {
    this.loadOrderStatuses();

    this.loadAllOrders();
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

  protected setCurrentOrderStatus(order: Order){
    this.previousOrderStatus = order.orderStatus;
  }

  protected setOrderStatus(order: Order){
    this.allowOrderStatusUpdates = false;
    this.isLoading = true;

    if(order.id){
      this.orderService.createOrderWithBooks(order, []).subscribe({
        complete: () => this.handleUpdateSuccessResponse(`Order status updated successfully!`),
        error: () => this.handleUpdateErrorResponse(order, `Order status could not be changed.`)
      })
    }
  }

  // Private methods
  /**
   * Handles the response when updating the state of a book from 'active' to 'inactive' or viceversa. Sets the value of 'active',
   * hides the progress bar, allows further changes and informs the user that the modification was successful.
   * @param book Book that was updated.
   * @param message Message to the user.
   */
  private handleUpdateErrorResponse(order: Order, message: string){
    if(this.previousOrderStatus){
      order.orderStatus = this.previousOrderStatus;
    }

    this.handleUpdateResponse(message);
  }

  /**
   * Handles the response when trying to update the state of a book. Hides the progress bar, allows further changes and
   * informs the user about the result of the modification.
   * @param message Message to the user.
   */
  private handleUpdateResponse(message: string){
    this.snackbar.open(message);

    this.isLoading = false;

    this.allowOrderStatusUpdates = true;
  }

  /**
   * Handles the error when trying to update the state of a book from 'active' to 'inactive' or viceversa. Hides the progress bar,
   * allows further changes and informs the user that the modification could not be done.
   * @param message Message to the user.
   */
  private handleUpdateSuccessResponse(message: string){
    this.loadAllOrders();

    this.handleUpdateResponse(message);
  }

  /**
   * Retrieves all elements from the database. Hides the progress bar when the data is loaded.
   */
  private loadAllOrders(){
    this.orderSubscription = this.orderService.getAll().subscribe({
      next: (response) => {
        this.data = response.content;

        this.dataSource.data = response.content;

        this.isLoading = false;
      }
    })
  }

  private loadOrderStatuses(){
    this.orderStatusSubscription = this.orderStatusService.getAll(true).subscribe((response) => {
      this.orderStatuses = response;
    })
  }
}
