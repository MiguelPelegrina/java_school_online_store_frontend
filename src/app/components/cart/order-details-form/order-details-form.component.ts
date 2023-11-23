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
import { informUserOfError } from 'src/app/shared/utils/utils';

/**
 * Angular component representing a form for order details. Includes inputs for selecting delivery method, order status, payment method, and payment status.
 */
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

  /**
   * Constructor of the component.
   * @param deliveryMethodService - Service for managing delivery methods
   * @param orderStatusService - Service for managing order statuses
   * @param paymentMethodService - Service for managing payment methods
   * @param paymentStatusService - Service for managing payment statuses
   * @param rootFormGroup - Reference to the root form group
   */
  constructor(
    private deliveryMethodService: DeliveryMethodService,
    private orderStatusService: OrderStatusService,
    private paymentMethodService: PaymentMethodService,
    private paymentStatusService: PaymentStatusService,
    private rootFormGroup: FormGroupDirective){
    super();
  }

  // Methods
  // Lifecycle hooks
  /**
   * A lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   * Fills the form to show the user their address and the options for delivery and payment methods.
   */
  public ngOnInit(): void {
    this.form = this.rootFormGroup.control.get(this.formGroupName) as FormGroup;

    this.loadDeliveryMethods();
    this.loadOrderStatuses();
    this.loadPaymentMethods();
    this.loadPaymentStatuses();

    this.selectedOrderStatus = this.form.value.orderStatus;
    this.selectedPaymentStatus = this.form.value.paymentStatus;
  }

  /**
   * A lifecycle hook that is called when a directive, pipe, or service is destroyed. Used for any custom cleanup that needs to occur when the instance is destroyed.
   * All subscriptions are unsubscribed.
   */
  public ngOnDestroy(): void {
    this.deliveryMethodSubscription?.unsubscribe();
    this.orderStatusSubscription?.unsubscribe();
    this.paymentMethodSubscription?.unsubscribe();
    this.paymentStatusSubscription?.unsubscribe();
  }

  // Private methods
  /**
   * Loads available delivery methods and updates the deliveryMethods array.
   */
  private loadDeliveryMethods(){
    this.deliveryMethodSubscription = this.deliveryMethodService.getAll(true).subscribe({
      next: (response) => {
        this.deliveryMethods = response;
      },
      error: (error) => {
        informUserOfError(error);
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
        informUserOfError(error);
      }
    })
  }

  /**
   * Loads available payment methods and updates the paymentMethods array.
   */
  private loadPaymentMethods(){
    this.paymentMethodSubscription = this.paymentMethodService.getAll(true).subscribe({
      next: (response) => {
        this.paymentMethods = response;
      },
      error: (error) => {
        informUserOfError(error);
      }
    })
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
        informUserOfError(error);
      }
    })
  }
}
