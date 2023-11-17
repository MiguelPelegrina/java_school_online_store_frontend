import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subscription, catchError, map, merge, startWith, switchMap } from 'rxjs';
import { OrderStatusService } from 'src/app/services/order/order-status/order-status.service';
import { OrderService } from 'src/app/services/order/order.service';
import { PaymentStatusService } from 'src/app/services/order/payment-status/payment-status.service';
import { SearchBarComponent } from 'src/app/shared/components/search-bar/search-bar.component';
import { Order } from 'src/app/shared/domain/order/order';
import { OrderStatus } from 'src/app/shared/domain/order/order-status/order-status';
import { PaymentStatus } from 'src/app/shared/domain/order/payment-status/payment-status';
import { IIndexable } from 'src/app/shared/utils/interfaces/i-indexable';
import { StringValues } from 'src/app/shared/utils/string-values';
import { informUserOfError } from 'src/app/shared/utils/utils';
import Swal from 'sweetalert2';

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

// TODO Advanced filter for orders:
// - Date
// - Delivery method
// - Order status
// - Payment method
// - Payment status
export class ListOrderComponent implements OnDestroy, OnInit {
  // Subcomponents
  @ViewChild(MatPaginator)
  protected paginator!: MatPaginator;

  @ViewChild(MatSort)
  protected sort!: MatSort;

  @ViewChild(SearchBarComponent)
  protected searchBar!: SearchBarComponent;

  // Fields
  protected allowUpdates = true;

  protected columnsToDisplay = ['date', 'user', 'deliveryMethod', 'paymentMethod', 'orderStatus', 'paymentStatus', 'expand'];

  protected data: Order[] = [];

  protected data$ = new Observable<Order[]>

  protected dataLength = 0;

  protected dataPage = 0;

  protected dataPageSize = StringValues.DEFAULT_PAGE_SIZE;

  protected dataPageSizeOptions: number[] = StringValues.DEFAULT_PAGE_SIZE_OPTIONS;

  protected dataSource = new MatTableDataSource<Order>(this.data);

  protected expandedElement?: Order | null;

  protected isClient?: boolean;

  protected isLoading = true;

  protected orderStatuses: OrderStatus[] = [];

  protected paymentStatuses: PaymentStatus[] = [];

  private orderStatusSubscription?: Subscription;

  private paymentStatusSubscription?: Subscription;

  private previousOrderStatus?: OrderStatus;

  private filter = '';

  constructor(
    private orderService: OrderService,
    private orderStatusService: OrderStatusService,
    private paymentStatusService: PaymentStatusService,
    private snackbar: MatSnackBar) {}

  /**
   * A lifecycle hook that is called after Angular has fully initialized a component's view.
   * Assigns the Paginator and the Sort components to the respective properties of the datasource to handle pages and sorting of the table.
   */
  public ngAfterViewInit(){
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    this.data$ = merge(this.sort.sortChange, this.paginator.page, this.searchBar.searchEvent).pipe(
      startWith({}),
      switchMap(() => {
        this.isLoading = true;

        this.dataPage = this.paginator.pageIndex;

        this.dataPageSize = this.paginator.pageSize;

        return this.orderService.getAll(this.filter, this.sort.direction, this.sort.active, this.paginator.pageIndex, this.dataPageSize).pipe(
          catchError((error) => {
            this.informUserOfError(error);
            return [];
          })
        );
      }),
      map(response => {
        if(response === null){
          return [];
        }
        this.isLoading = false;

        this.dataLength = response.totalElements;

        this.dataPage = response.pageable.pageNumber;

        return response.content;
      }),
    )

    this.dataSource.sortingDataAccessor = (item, property) => {
      switch(property) {
        case 'deliveryMethod.name': return item.deliveryMethod.name;
        case 'orderStatus.name': return item.orderStatus.name;
        case 'paymentMethod.name': return item.paymentMethod.name;
        case 'paymentStatus.name': return item.paymentStatus.name;
        case 'user.surname': return item.user.surname;
        default: return (item as IIndexable<Order>)[property];
      }
    }
  }


  /**
   * A lifecycle hook that is called when a directive, pipe, or service is destroyed. Used for any custom cleanup that needs to occur when the instance is destroyed.
  */
 public ngOnDestroy(): void {
   this.orderStatusSubscription?.unsubscribe();
   this.paymentStatusSubscription?.unsubscribe();
  }

  /**
   * A lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   * Fills the table with data from the database and sets the filter of the searchbar
   */
  public ngOnInit(): void {
    this.loadOrderStatuses();
    this.loadPaymentStatuses();

    this.loadAllOrders();
  }

  protected getTotal(): number | undefined{
    return this.expandedElement?.orderedBooks.map((orderedBook) => orderedBook.amount * orderedBook.book.price).reduce((prev, current) => prev + current, 0);
  }

  protected reorder(order: Order){
    Swal.fire({
      title:'Confirm reorder',
      text: 'Are you sure you want to reorder this?',
      icon: 'info',
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'})
    .then((result) => {
      if(result.isConfirmed){

        order.id = undefined;
        order.date = new Date();
        order.orderStatus.name = StringValues.DEFAULT_ORDER_STATUS_ON_ORDER;
        order.paymentStatus.name = StringValues.DEFAULT_PAYMENT_STATUS_ON_ORDER;

        this.orderService.createOrderWithBooks(order, order.orderedBooks).subscribe({
          next: () => {
            this.loadAllOrders();
            Swal.fire('Reorder successful', '', 'success');
          },
          error: (error) => {
            this.informUserOfError(error);
          }
        });
      }
    })
  }

  protected setFilter(filter: string){
    this.filter = filter;
  }

  protected setOrderStatus(order: Order){
    this.allowUpdates = false;
    this.isLoading = true;

    if(order.id){
      this.orderService.createOrderWithBooks(order, []).subscribe({
        complete: () => this.handleUpdateSuccessResponse(`Order status updated successfully!`),
        error: () => this.handleUpdateErrorResponse(order, `Order status could not be changed.`)
      })
    }
  }

  protected setPaymentStatus(order: Order){
    this.allowUpdates = false;
    this.isLoading = true;

    if(order.id){
      this.orderService.createOrderWithBooks(order, []).subscribe({
        complete: () => this.handleUpdateSuccessResponse(`Payment status updated successfully!`),
        error: () => this.handleUpdateErrorResponse(order, `Payment status could not be changed.`)
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

    Swal.fire('An error ocurred', message, 'warning');

    this.isLoading = false;

    this.allowUpdates = true;
  }

  /**
   * Handles the response when trying to update the state of a book. Hides the progress bar, allows further changes and
   * informs the user about the result of the modification.
   * @param message Message to the user.
   */
  private handleUpdateResponse(message: string){
    this.snackbar.open(message);

    this.isLoading = false;

    this.allowUpdates = true;
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

  private informUserOfError(error: any){
    this.isLoading = false;
    informUserOfError(error)
  }

  /**
   * Retrieves all elements from the database. Hides the progress bar when the data is loaded.
   */
  private loadAllOrders(){
    this.orderService.getAll().subscribe({
      next: (response) => {
        this.data = response.content;

        this.dataSource.data = response.content;

        this.isLoading = false;
      },
      error: (error) => {
        this.informUserOfError(error);
      }
    })
  }

  private loadOrderStatuses(){
    this.orderStatusSubscription = this.orderStatusService.getAll(true).subscribe({
      next: (response) => {
        this.orderStatuses = response;
        Swal.fire('Reorder successful', '', 'success');
      },
      error: (error) => {
        this.informUserOfError(error);
      }
    });
  }

  private loadPaymentStatuses(){
    this.paymentStatusSubscription = this.paymentStatusService.getAll(true).subscribe((response) => {
      this.paymentStatuses = response;
    })
  }
}
