import { Book } from "../book/book";
import { Order } from "./order";

export interface OrderedBook {
  amount: number;
  book: Book,
  id: number,
  order?: Order,
}
