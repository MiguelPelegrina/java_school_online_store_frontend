// Source: https://stackoverflow.com/questions/34727936/typescript-bracket-notation-property-access/55108590#55108590
export interface IIndexable<T = any> {
  [key: string]: any;
}
