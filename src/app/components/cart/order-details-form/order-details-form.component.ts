import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormGroupDirective } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DeliveryMethodService } from 'src/app/services/order/delivery-method/delivery-method.service';
import { OrderStatusService } from 'src/app/services/order/order-status/order-status.service';
import { PaymentMethodService } from 'src/app/services/order/payment-method/payment-method.service';
import { PaymentStatusService } from 'src/app/services/order/payment-status/payment-status.service';
import { AbstractForm } from 'src/app/shared/components/abstract-form';
import { DeliveryMethod } from 'src/app/shared/domain/order/delivery-method/delivery-method';
import { OrderStatus } from 'src/app/shared/domain/order/order-status/order-status';
import { PaymentMethod } from 'src/app/shared/domain/order/payment-method/payment-method';
import { PaymentStatus } from 'src/app/shared/domain/order/payment-status/payment-status';

@Component({
  selector: 'app-order-details-form',
  templateUrl: './order-details-form.component.html',
  styleUrls: ['./order-details-form.component.css', '../../../app.component.css']
})
export class OrderDetailsFormComponent extends AbstractForm implements OnDestroy, OnInit {
  // Fields
  @Input()
  public formGroupName!: string;
  @Input()
  public selectedDeliveryMethod? = '';
  @Input()
  public selectedOrderStatus? = '';
  @Input()
  public selectedPaymentMethod? = '';
  @Input()
  public selectedPaymentStatus? = '';

  protected deliveryMethods: DeliveryMethod[] = [];
  protected orderStatuses: OrderStatus[] = [];
  protected paymentMethods: PaymentMethod[] = [];
  protected paymentStatuses: PaymentStatus[] = [];

  private deliveryMethodSubscription?: Subscription;
  private orderStatusSubscription?: Subscription;
  private paymentMethodSubscription?: Subscription;
  private paymentStatusSubscription?: Subscription;

  constructor(
    private deliveryMethodService: DeliveryMethodService,
    private orderStatusService: OrderStatusService,
    private paymentMethodService: PaymentMethodService,
    private paymentStatusService: PaymentStatusService,
    private rootFormGroup: FormGroupDirective){
    super();
  }

  // Methods
  // Public methods
  public ngOnInit(): void {
    this.form = this.rootFormGroup.control.get(this.formGroupName) as FormGroup;

    this.loadDeliveryMethods();
    this.loadOrderStatuses();
    this.loadPaymentMethods();
    this.loadPaymentStatuses();

    this.selectedOrderStatus = this.form.value.orderStatus;
    this.selectedPaymentStatus = this.form.value.paymentStatus;
  }

  public ngOnDestroy(): void {
    this.deliveryMethodSubscription?.unsubscribe();
    this.orderStatusSubscription?.unsubscribe();
    this.paymentMethodSubscription?.unsubscribe();
    this.paymentStatusSubscription?.unsubscribe();
  }

  // Private methods
  private loadDeliveryMethods(){
    this.deliveryMethodSubscription = this.deliveryMethodService.getAll(true).subscribe((response) => {
      this.deliveryMethods = response;
    })
  }

  private loadOrderStatuses(){
    this.orderStatusSubscription = this.orderStatusService.getAll(true).subscribe((response) => {
      this.orderStatuses = response;
    })
  }

  private loadPaymentMethods(){
    this.paymentMethodSubscription = this.paymentMethodService.getAll(true).subscribe((response) => {
      this.paymentMethods = response;
    })
  }

  private loadPaymentStatuses(){
    this.paymentStatusSubscription = this.paymentStatusService.getAll(true).subscribe((response) => {
      this.paymentStatuses = response;
    })
  }

}
