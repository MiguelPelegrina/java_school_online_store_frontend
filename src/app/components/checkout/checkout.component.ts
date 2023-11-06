import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { CartService } from 'src/app/services/cart/cart.service';
import { UserService } from 'src/app/services/user.service';
import { Book } from 'src/app/shared/domain/book/book';
import { BoughtBook } from 'src/app/shared/domain/book/bought-book/bought-book';
import { Cart } from 'src/app/shared/domain/cart/cart';
import { AuthResultDto } from 'src/app/shared/utils/interfaces/authResultDto';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {
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
  ];

  protected id?: number;

  protected loading = true;

  protected number?: number;

  protected postalCode= '';

  protected rowHeight = 400;

  protected street = '';

  constructor(private cartService: CartService, private usersService: UserService, private router: Router){
  }

  // Methods
  // Public methods
  public ngOnInit(): void {
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

    this.cartService.cartSubject.subscribe((_cart: Cart) => {
      this.cart = _cart;
      this.dataSource = this.cart.boughtBooks;
      console.log(this.dataSource)
    })
  }

  // Protected methods
  protected getTotal(boughtBooks: BoughtBook[]): number{
    return this.cartService.getTotal(boughtBooks);
  }
}
