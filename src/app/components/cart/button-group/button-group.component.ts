import { AfterContentInit, Component, Input } from '@angular/core';
import { CartService } from 'src/app/services/cart/cart.service';
import { BoughtBook } from 'src/app/shared/domain/book/bought-book/bought-book';

@Component({
  selector: 'app-button-group',
  templateUrl: './button-group.component.html',
  styleUrls: ['./button-group.component.css']
})
export class ButtonGroupComponent implements AfterContentInit{
  @Input()
  public element!: BoughtBook;

  protected isDisabled = true;

  constructor(private cartService: CartService){}

  public ngAfterContentInit(): void {
    this.isDisabled = !this.cartService.enoughStock(this.element);
  }

  protected onAddQuantity(){
    this.cartService.addToCart(this.element);
    this.isDisabled = !this.cartService.enoughStock(this.element);
  }

  protected onRemoveQuantity(): void{
    this.cartService.removeQuantity(this.element);
    this.isDisabled = !this.cartService.enoughStock(this.element);
  }
}
