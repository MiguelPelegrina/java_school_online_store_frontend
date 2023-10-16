import { BookParameterFormats } from "../../enums/book-parameter-formats";

export interface BookParamters {
  id: number,
  author: string,
  format: BookParameterFormats,
  active: boolean,
}
