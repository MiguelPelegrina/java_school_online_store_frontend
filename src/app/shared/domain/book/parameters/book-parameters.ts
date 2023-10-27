import { BookFormat } from "./book-parameters-format/book-parameters-format";

export interface BookParameters {
  id: number,
  author: string,
  format: BookFormat,
  active: boolean,
}
