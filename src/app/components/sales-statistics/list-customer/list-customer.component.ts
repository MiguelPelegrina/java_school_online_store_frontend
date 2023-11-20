import { trigger, state, style, transition, animate } from '@angular/animations';
import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subscription, map, merge, startWith, switchMap } from 'rxjs';
import { UserService } from 'src/app/services/user/user.service';
import { SearchBarComponent } from 'src/app/shared/components/search-bar/search-bar.component';
import { User } from 'src/app/shared/domain/user/user';
import { ANIMATION_DURATION, StringValues } from 'src/app/shared/utils/string-values';

@Component({
  selector: 'app-list-customer',
  templateUrl: './list-customer.component.html',
  styleUrls: ['./list-customer.component.css', '../../../app.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed, void', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate(ANIMATION_DURATION)),
      transition('expanded <=> void', animate(ANIMATION_DURATION))
    ]),
  ],
})
export class ListCustomerComponent implements AfterViewInit, OnDestroy {
  // Subcomponents
  @ViewChild(MatPaginator)
  protected paginator!: MatPaginator;

  @ViewChild(MatSort)
  protected sort!: MatSort;

  @ViewChild(SearchBarComponent)
  protected searchBar!: SearchBarComponent;

  // Fields
  protected allowUpdates = true;

  protected columnsToDisplay: string [] = ['surname', 'name', 'dateOfBirth', 'email', 'active', 'phone', 'expand'];

  protected data: User[] = [];

  protected data$ = new Observable<User[]>();

  protected dataLength = 0;

  protected currentPageIndex = 0;

  protected dataPageSize = StringValues.DEFAULT_PAGE_SIZE;

  protected dataPageSizeOptions: number[] = StringValues.DEFAULT_PAGE_SIZE_OPTIONS;

  protected dataSource = new MatTableDataSource<User>(this.data);

  protected expandedElement?: User;

  protected isLoading = true;

  private userSubscription?: Subscription;

  private active?: boolean;

  private filter = '';

  /**
   * Constructor
   * @param userService The service for managing user-related operations.
   * @param snackbar The Material Snack Bar to communicate information to the user.
   */
  constructor(private userService: UserService, private snackbar: MatSnackBar) {}

  // Methods
  // Lifecycle hooks
  /**
   * A lifecycle hook that is called after Angular has fully initialized a component's view.
   * Loads all customer from the customer service.
   */
  public ngAfterViewInit(){
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    this.data$ = merge(this.sort.sortChange, this.paginator.page, this.searchBar.searchEvent).pipe(
      startWith({}),
      switchMap(() => {
        this.isLoading = true;

        this.currentPageIndex = this.paginator.pageIndex;

        this.dataPageSize = this.paginator.pageSize;

        return this.userService.getAll(this.active, this.filter, this.sort.direction, this.sort.active, this.paginator.pageIndex, this.dataPageSize);
      }),
      map(response => {
        this.isLoading = false;

        if(response === null){
          return [];
        }

        this.dataLength = response.totalElements;

        this.currentPageIndex = response.pageable.pageNumber;

        return response.content;
      }),
    )
  }

  /**
   * A lifecycle hook that is called when a directive, pipe, or service is destroyed. Used for any custom cleanup that needs to occur when the instance is destroyed.
   */
  public ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
  }

  // Protected methods
  /**
   * Sets the user 'active' state. If it was active before, it's not active now and viceversa. Disables the toggle button during the transaction until success or error.
   * @param user User whose 'active' state will be changed.
   */
  protected setUserActivity(user: User){
    this.allowUpdates = false;
    this.isLoading = true;

    this.userSubscription = this.userService.update(user.id, user).subscribe({
      complete: () => this.handleUpdateSuccessResponse(`Activity of ${user.email} updated successfully!`),
      error: () => this.handleUpdateErrorResponse(user, `Activity of ${user.email} could not be changed.`)
    })
  }

  protected setFilter(filter: string){
    this.filter = filter;
  }

  // Private methods
  /**
   * Retrieves all elements from the database. Hides the progress bar when the data is loaded.
   */
  private loadAllUsers(){
    this.userSubscription = this.userService.getAll().subscribe({
      next: (response) => {
        this.data = response.content;

        this.dataSource.data = response.content;

        this.isLoading = false;
      }
    });
  }

  /**
   * Handles the response when updating the state of a user from 'active' to 'inactive' or viceversa. Sets the value of 'active',
   * hides the progress bar, allows further changes and informs the user that the modification was successful.
   * @param user User that was updated.
   * @param message Message to the user.
   */
  private handleUpdateErrorResponse(user: User, message: string){
    user.active = !user.active;

    this.handleUpdateResponse(message);
  }

  /**
   * Handles the response when trying to update the state of a user. Hides the progress bar, allows further changes and
   * informs the user about the result of the modification.
   * @param message Message to the user.
   */
  private handleUpdateResponse(message: string){
    this.snackbar.open(message);

    this.isLoading = false;

    this.allowUpdates = true;
  }

  /**
   * Handles the error when trying to update the state of a user from 'active' to 'inactive' or viceversa. Hides the progress bar,
   * allows further changes and informs the user that the modification could not be done.
   * @param message Message to the user.
   */
  private handleUpdateSuccessResponse(message: string){
    this.loadAllUsers();

    this.handleUpdateResponse(message);
  }
}
