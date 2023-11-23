import { AfterContentInit, Component, Input } from '@angular/core';
import { CartService } from 'src/app/services/cart/cart.service';
import { BoughtBook } from 'src/app/shared/domain/book/bought-book/bought-book';

/**
 * Component representing a button group for managing the quantity of a bought book in the cart.
 */
@Component({
  selector: 'app-button-group',
  templateUrl: './button-group.component.html',
  styleUrls: ['./button-group.component.css']
})
export class ButtonGroupComponent implements AfterContentInit{
  @Input()
  public element!: BoughtBook;

  protected isDisabled = true;

  /**
   * Constructor of the component.
   * @param cartService - Service for managing the shopping cart
   */
  constructor(private cartService: CartService){}

  // Methods
  // Lifecycle hooks
  /**
   * A lifecycle hook that is called after Angular has fully initialized all content of a directive. It will run only once when the projected content is initialized.
   * It sets the initial disabled state of the buttons based on the stock availability.
   */
  public ngAfterContentInit(): void {
    this.isDisabled = !this.cartService.enoughStock(this.element);
  }

  // Protect methods
  /**
   * Increases the quantity of the bought book in the cart and updates the disabled state of the buttons.
   */
  protected onAddQuantity(){
    this.cartService.addToCart(this.element);
    this.isDisabled = !this.cartService.enoughStock(this.element);
  }

  /**
   * Decreases the quantity of the bought book in the cart and updates the disabled state of the buttons.
   */
  protected onRemoveQuantity(): void{
    this.cartService.removeQuantity(this.element);
    this.isDisabled = !this.cartService.enoughStock(this.element);
  }
}
