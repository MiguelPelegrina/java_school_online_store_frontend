import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { CartService } from 'src/app/services/cart/cart.service';
import { UserService } from 'src/app/services/user.service';
import { BoughtBook } from 'src/app/shared/domain/book/bought-book/bought-book';
import { Cart } from 'src/app/shared/domain/cart/cart';
import { AuthResultDto } from 'src/app/shared/utils/authResultDto';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit{
  // Fields
  protected cart: Cart = { boughtBooks: []};

  protected city = '';

  protected cols = 1;

  protected country = '';

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

  protected number?: number;

  protected postalCode= '';

  protected rowHeight = 400;

  protected street = '';

  constructor(private cartService: CartService,
    private fb: FormBuilder,
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

      this.usersService.getById(this.id!).subscribe((response) => {
        this.country = response.address.postalCode.city.country.name;
        this.city = response.address.postalCode.city.name;
        this.postalCode = response.address.postalCode.code;
        this.street = response.address.street;
        this.number = response.address.number;

        this.loading = false;
      })
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

    this.loadFilledUserForm();
  }

  private loadFilledUserForm() {
    this.usersService.getById(this.id!).subscribe((response) => {

    this.form = this.fb.group({
      address: this.fb.group({
        country: [response.address.postalCode.city.country.name],
        city: [response.address.postalCode.city.name],
        number: [response.address.number],
        postalCode: [response.address.postalCode.code],
        street: [response.address.street]
      })
    });
    this.city = response.address.postalCode.city.name;
    this.country = response.address.postalCode.city.country.name;
    this.postalCode = response.address.postalCode.code;

    this.loading = false;
    })
  }

  // Protected methods
  protected getTotal(boughtBooks: BoughtBook[]): number{
    return this.cartService.getTotal(boughtBooks);
  }

  protected onClearCart(): void {
    // TODO Ask user for confirmation
    this.cartService.clearCart();
  }

  protected onAddQuantity(boughtBook: BoughtBook){
    this.cartService.addToCart(boughtBook);
  }

  protected onRemoveFromCart(bookBought: BoughtBook): void {
    this.cartService.removeFromCart(bookBought);
  }

  protected onRemoveQuantity(boughtBook: BoughtBook): void{
    this.cartService.removeQuantity(boughtBook);
  }
}
