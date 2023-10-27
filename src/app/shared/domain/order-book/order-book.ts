import { Book } from "../book/book";
import { Order } from "../order/order";

export interface OrderBook{
  id: number,
  orderId: Order,
  bookId: Book,
  amount: number,
}
