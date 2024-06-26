import { trigger, state, style, transition, animate } from '@angular/animations';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxPermissionsService } from 'ngx-permissions';
import { Observable, Subscription, catchError, map, merge, startWith, switchMap } from 'rxjs';
import { CartService } from 'src/app/services/cart/cart.service';
import { OrderStatusService } from 'src/app/services/order/order-status/order-status.service';
import { OrderService } from 'src/app/services/order/order.service';
import { PaymentStatusService } from 'src/app/services/order/payment-status/payment-status.service';
import { SearchBarComponent } from 'src/app/components/search-bar/search-bar.component';
import { Order } from 'src/app/shared/domain/order/order';
import { OrderStatus } from 'src/app/shared/domain/order/order-status/order-status';
import { PaymentStatus } from 'src/app/shared/domain/order/payment-status/payment-status';
import { AuthUtils } from 'src/app/shared/utils/auth-utils';
import { IIndexable } from 'src/app/shared/utils/interfaces/i-indexable';
import { ANIMATION_DURATION, StringValues } from 'src/app/shared/utils/string-values';
import { informUserOfError } from 'src/app/shared/utils/utils';
import Swal from 'sweetalert2';
import { v4 as uuidv4 } from 'uuid';

/**
 * Component that lists all orders in a table.
 */
@Component({
  selector: 'app-list-order',
  templateUrl: './list-order.component.html',
  styleUrls: ['./list-order.component.css', '../../../app.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed, void', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate(ANIMATION_DURATION)),
      transition('expanded <=> void', animate(ANIMATION_DURATION))
    ]),
  ],
})
export class ListOrderComponent implements AfterViewInit, OnDestroy, OnInit {
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

   /**
   * Constructor
   * @param orderService - Service for handling order-related operations.
   * @param orderStatusService - Service for handling order status-related operations.
   * @param paymentStatusService - Service for handling payment status-related operations.
   * @param snackbar - Service for displaying snack bar messages.
   */
  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private orderStatusService: OrderStatusService,
    private paymentStatusService: PaymentStatusService,
    private permissionsService: NgxPermissionsService,
    private snackbar: MatSnackBar
  ) {}

  // Methods
  // Lifecycle hooks
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
    this.permissionsService.loadPermissions(AuthUtils.getRoles());

    this.loadOrderStatuses();
    this.loadPaymentStatuses();

    this.loadAllOrders();
  }

  // Protected methods
  /**
   * Generates a PDF for a specific order and triggers a download of the PDF file.
   *
   * @param {number} id - The ID of the order for which the PDF should be generated.
   */
  protected generateOrderPDF(id: number){
    this.orderService.generateOrderPDF(id).subscribe((blob) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${uuidv4()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  /**
   * Gets the total cost of the expanded order.
   * @returns The total cost of the expanded order.
   */
  protected getTotal(): number | undefined{
    return this.expandedElement?.orderedBooks.map((orderedBook) => orderedBook.amount * orderedBook.book.price).reduce((prev, current) => prev + current, 0);
  }

  /**
   * Initiates the reorder process for the specified order. Displays a confirmation dialog before reordering.
   * @param order - The order to be reordered.
   */
  protected reorder(order: Order){
    this.cartService.reorder(order);
  }

  /**
   * Sets the filter for the orders based on the search bar input.
   * @param filter - The filter string.
   */
  protected setFilter(filter: string){
    this.filter = filter;
  }

  /**
   * Sets the order status for the specified order. Initiates the update process and handles the response.
   * @param order - The order to be updated.
   */
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

  /**
   * Sets the payment status for the specified order.
   * Initiates the update process and handles the response.
   * @param order - The order to be updated.
   */
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
    informUserOfError(error);
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

  /**
   * Loads available order statuses and updates the orderStatuses array.
   */
  private loadOrderStatuses(){
    this.orderStatusSubscription = this.orderStatusService.getAll(true).subscribe({
      next: (response) => {
        this.orderStatuses = response;
      },
      error: (error) => {
        this.informUserOfError(error);
      }
    });
  }

  /**
   * Loads available payment statuses and updates the paymentStatuses array.
   */
  private loadPaymentStatuses(){
    this.paymentStatusSubscription = this.paymentStatusService.getAll(true).subscribe({
      next: (response) => {
        this.paymentStatuses = response;
      },
      error: (error) => {
        this.informUserOfError(error)
      }
    })
  }
}
