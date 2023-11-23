import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper, StepperOrientation } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { Observable, map } from 'rxjs';
import { CartService } from 'src/app/services/cart/cart.service';
import { OrderService } from 'src/app/services/order/order.service';
import { UserService } from 'src/app/services/user/user.service';
import { BoughtBook } from 'src/app/shared/domain/book/bought-book/bought-book';
import { Cart } from 'src/app/shared/domain/cart/cart';
import { Order } from 'src/app/shared/domain/order/order';
import { User } from 'src/app/shared/domain/user/user';
import { AuthResultDto } from 'src/app/shared/utils/interfaces/authResultDto';
import { StringValues } from 'src/app/shared/utils/string-values';
import { informUserOfError } from 'src/app/shared/utils/utils';
import Swal from 'sweetalert2';

/**
 *  Represents the shopping cart functionality for user orders.
 */
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit{
  // Subcomponents
  @ViewChild('stepper')
  private stepper!: MatStepper;

  // Fields
  protected cart: Cart = { boughtBooks: []};

  protected dataSource: BoughtBook[] = [];

  protected displayedColumns: string[] = [
    'book',
    'title',
    'price',
    'quantity',
    'total',
    'actions'
  ];

  protected form!: FormGroup;

  protected id?: number;

  protected loading = true;

  protected selectedOrderStatus = StringValues.DEFAULT_ORDER_STATUS_ON_ORDER;

  protected selectedPaymentStatus = StringValues.DEFAULT_PAYMENT_STATUS_ON_ORDER;

  protected stepperOrientation: Observable<StepperOrientation>;

  protected user?: User;

  /**
   * Constructor
   * @param cartService - Service for managing the user's shopping cart.
   * @param fb - FormBuilder for handling reactive forms.
   * @param orderService - Service for managing user orders.
   * @param router - Angular router for navigation.
   * @param usersService - Service for managing user data.
   * @param breakpointObserver - Observer for breakpoints to determine stepper orientation.
   */
  constructor(
    private cartService: CartService,
    private fb: FormBuilder,
    private orderService: OrderService,
    private router: Router,
    private usersService: UserService,
    breakpointObserver: BreakpointObserver
    ){
      this.stepperOrientation = breakpointObserver
        .observe('(min-width:800px)')
        .pipe(map(({matches}) => (matches ? 'horizontal' : 'vertical')));
    }

  // Methods
  // Lifecycle hooks
  /**
   * A lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   * Fills the cart with data from the localStorage. If the user is not logged in, they are redirected to the login.
   */
  public ngOnInit(): void {
    this.cartService.cartSubject.subscribe((_cart: Cart) => {
      this.cart = _cart;
      this.dataSource = this.cart.boughtBooks;
    });

    const token = localStorage.getItem('auth_token');

    if(token){
      const tokenInfo: AuthResultDto = jwtDecode(token);
      this.id = tokenInfo.id;

      this.loadUser();
    } else {
      this.redirectUserToLogin();
    }
  }



  // Protected methods
  /**
   * Calculates the total price of bought books in the cart.
   * @param boughtBooks - Books in the cart.
   * @returns - Total price.
   */
  protected getTotal(boughtBooks: BoughtBook[]): number{
    return this.cartService.getTotal(boughtBooks);
  }

  /**
   * Clears the shopping cart.
   */
  protected onClearCart(): void {
    // TODO Ask user for confirmation
    this.cartService.clearCart();
  }

  /**
   * Submits the order after user confirmation.
   * Creates an order with books, clears the cart, and displays a success message.
   */
  protected onSubmit(){
    if(!this.form.invalid){
      Swal.fire({
        title: 'Confirm your order',
        icon: 'info',
        showCancelButton: true,
        focusConfirm: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
      }).then((result) => {
        if(result.isConfirmed){
          this.createOrder();
        }
      })
    }
  }

  /**
 * Creates a new order using the form data, user information, and items in the shopping cart. Submits the order to the order service and handles
 * the success and error scenarios accordingly.
 */
  private createOrder() {
    const order: Order = {
      orderedBooks: [],
      date: new Date(),
      deliveryMethod: {name: this.form.value.orderDetails.deliveryMethod},
      orderStatus: {name: this.selectedOrderStatus},
      paymentMethod: {name: this.form.value.orderDetails.paymentMethod},
      paymentStatus: {name: this.selectedPaymentStatus},
      user: this.user!
    };

    const orderedBooks = this.cart.boughtBooks.map((book) => {
      return {
        book: book,
        amount: book.quantity,
        id: 0,
      };
    });

    this.orderService.createOrderWithBooks(order, orderedBooks).subscribe({
      next: () => {
        this.stepper.next();
        this.cartService.clearCart();
        Swal.fire('Order issued succesfully', '', 'success');
      },
      error: (error) => {
        informUserOfError(error);
      }
    });
  }

   /**
   * Removes a book from the shopping cart.
   * @param bookBought - Book to be removed.
   */
  protected onRemoveFromCart(bookBought: BoughtBook): void {
    this.cartService.removeFromCart(bookBought);
  }

  // Private methods
  /**
   * Fills the reactive form with user address and order details.
   * @param response - User information.
   */
  private fillOrderForm(response: any){
    this.form = this.fb.group({
      address: this.fb.group({
        country: [{value: response.address.postalCode.city.country.name, disabled: true}, Validators.required],
        city: [{value:response.address.postalCode.city.name, disabled: true}, Validators.required],
        number: [{value:response.address.number, disabled: true}, Validators.required],
        postalCode: [{value:response.address.postalCode.code, disabled: true}, Validators.required],
        street: [{value:response.address.street, disabled: true}, Validators.required]
      }),
      orderDetails: this.fb.group({
        deliveryMethod: ['', Validators.required],
        orderStatus: [{value: this.selectedOrderStatus, disabled: true}, Validators.required],
        paymentMethod: ['', Validators.required],
        paymentStatus: [{value: this.selectedPaymentStatus, disabled: true}, Validators.required],
      })
    });
  }

  /**
   * Loads user information based on the authenticated user ID.
   */
  private loadUser() {
    this.usersService.getById(this.id!).subscribe((response) => {
      this.user = response;

      this.fillOrderForm(response);

      this.loading = false;
    })
  }

 /**
  * Informing the user that they need to log in before checking out. If the user confirms, it redirects them to the login page.
  */
  private redirectUserToLogin() {
    Swal.fire({
      allowEscapeKey: false,
      allowOutsideClick: false,
      title: 'You need to log in before checking out',
      icon: 'warning',
      focusConfirm: true,
      confirmButtonText: 'Login',
    }).then(() => {
        this.router.navigate(['/auth/login']);
    })
  }
}
