import { BookGenres } from "../enums/book-genres";
import { BookParameterFormats } from "../enums/book-parameter-formats";

export interface Book {
  id: number;
  title: string;
  price: number;
  isbn: string;
  author: string;
  genre: BookGenres;
  parameters: BookParameterFormats;
  stock: number;
  isActive: boolean;
  // TODO Correct data type? byte[] in backend
  image?: number[];
}
