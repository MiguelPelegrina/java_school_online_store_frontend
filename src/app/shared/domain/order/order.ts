import { DeliveryMethods } from "../enums/delivery-methods";
import { OrderStatuses } from "../enums/order-status";
import { PaymentMethods } from "../enums/payment-methods";
import { PaymentStatuses } from "../enums/payment-statuses";
import { User } from "../user/user";

export interface Order {
  id: number;
  user: User;
  // TODO Would it be better just as string instead of enums?
  deliveryMethod: DeliveryMethods;
  orderStatus: OrderStatuses;
  paymentMethods: PaymentMethods;
  paymentStatuses: PaymentStatuses;
  date: Date;
}
