import { Book } from "../book";

export interface BoughtBook extends Book{
  quantity: number,
}
