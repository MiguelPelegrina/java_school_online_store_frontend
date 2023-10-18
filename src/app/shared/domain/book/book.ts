import { BookGenre } from "./book-genre/book-genre";
import { BookParameters } from "./parameters/book-parameters";

export interface Book {
  id: number;
  title: string;
  price: number;
  isbn: string;
  genre: BookGenre;
  parameters: BookParameters;
  stock: number;
  active: boolean;
  // TODO Correct data type? byte[] in backend
  image?: string | ArrayBuffer | null;
}
