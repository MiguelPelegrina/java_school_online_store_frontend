import { User } from "../user/user";
import { DeliveryMethod } from "./delivery-method/delivery-method";
import { OrderStatus } from "./order-status/order-status";
import { OrderedBook } from "./ordered-book";
import { PaymentMethod } from "./payment-method/payment-method";
import { PaymentStatus } from "./payment-status/payment-status";

export interface Order {
  id?: number;
  user: User;
  deliveryMethod: DeliveryMethod;
  orderStatus: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderedBooks: OrderedBook[];
  date: Date;
}
