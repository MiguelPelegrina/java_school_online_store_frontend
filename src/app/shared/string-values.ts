export class StringValues{
  public static BASE_URL:string = 'http://localhost:8081'

  /////////////////////////////////////////////////////
  // Books
  /////////////////////////////////////////////////////
  public static BOOK_URL: string = '/books';
  public static BASE_BOOK_URL: string = `${this.BASE_URL}${this.BOOK_URL}`;

  //////////////////////////////////////////////////////
  // Countries
  //////////////////////////////////////////////////////
  public static COUNTRY_URL: string = '/countries';
  public static BASE_COUNTRY_URL: string = `${this.BASE_URL}${this.COUNTRY_URL}`;

  /////////////////////////////////////////////////////
  // Orders
  /////////////////////////////////////////////////////
  public static ORDER_URL: string = '/orders';
  public static BASE_ORDER_URL: string = `${this.BASE_URL}${this.ORDER_URL}`;
}
