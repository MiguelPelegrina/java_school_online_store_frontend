import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { CartService } from 'src/app/services/cart/cart.service';
import { OrderService } from 'src/app/services/order/order.service';
import { UserService } from 'src/app/services/user.service';
import { BoughtBook } from 'src/app/shared/domain/book/bought-book/bought-book';
import { Cart } from 'src/app/shared/domain/cart/cart';
import { Order } from 'src/app/shared/domain/order/order';
import { User } from 'src/app/shared/domain/user/user';
import { AuthResultDto } from 'src/app/shared/utils/interfaces/authResultDto';
import { StringValues } from 'src/app/shared/utils/string-values';
import Swal from 'sweetalert2';

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

  protected user?: User;

  constructor(
    private cartService: CartService,
    private fb: FormBuilder,
    private orderService: OrderService,
    private router: Router,
    private usersService: UserService){}

  // Methods
  // Public methods
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
      Swal.fire({
        allowEscapeKey: false,
        allowOutsideClick: false,
        title: 'You need to log in before checking out',
        icon: 'warning',
        focusConfirm: true,
        confirmButtonText: 'Login',
      }).then((result) => {
        if(result.isConfirmed){
          this.router.navigate(['/auth/login']);
        }
      })
    }
  }

  private loadUser() {
    this.usersService.getById(this.id!).subscribe((response) => {
      this.user = response;

      this.fillOrderForm(response);

      this.loading = false;
    })
  }

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

  // Protected methods
  protected getTotal(boughtBooks: BoughtBook[]): number{
    return this.cartService.getTotal(boughtBooks);
  }

  protected onAddQuantity(boughtBook: BoughtBook){
    this.cartService.addToCart(boughtBook);
  }

  protected onClearCart(): void {
    // TODO Ask user for confirmation
    this.cartService.clearCart();
  }

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
          const order: Order = {
            orderedBooks: [],
            date: new Date(),
            deliveryMethod: {name: this.form.value.orderDetails.deliveryMethod},
            orderStatus: {name: this.selectedOrderStatus},
            paymentMethod: {name: this.form.value.orderDetails.paymentMethod},
            paymentStatus: {name: this.selectedPaymentStatus},
            user: this.user!
          };

          // TODO Might need to assign id with a sequencer and then have Set type instead of List type in backend
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
            error: () => {
              Swal.fire('An error ocurred, contact your support', '', 'warning');
            }
          });
        }
      })
    }
  }

  protected onRemoveFromCart(bookBought: BoughtBook): void {
    this.cartService.removeFromCart(bookBought);
  }

  protected onRemoveQuantity(boughtBook: BoughtBook): void{
    this.cartService.removeQuantity(boughtBook);
  }
}
