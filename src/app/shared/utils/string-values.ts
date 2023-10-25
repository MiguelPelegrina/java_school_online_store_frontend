export class StringValues{
  public static BASE_URL: string = 'http://localhost:8081'

  /////////////////////////////////////////////////////
  // Authentication
  /////////////////////////////////////////////////////
  private static AUTH_URL: string = '/auth';
  private static LOGIN_URL: string = '/login'
  private static REGISTER_URL: string = '/register'
  public static BASE_LOGIN_URL: string = `${this.BASE_URL}${this.AUTH_URL}${this.LOGIN_URL}`
  public static BASE_REGISTER_URL: string = `${this.BASE_URL}${this.AUTH_URL}${this.REGISTER_URL}`

  /////////////////////////////////////////////////////
  // Books
  /////////////////////////////////////////////////////
  public static BOOK_URL: string = '/books';
  public static BASE_BOOK_URL: string = `${this.BASE_URL}${this.BOOK_URL}`;

  /////////////////////////////////////////////////////
  // Book formats
  /////////////////////////////////////////////////////
  public static BOOK_FORMAT_URL: string = '/book_parameters_format';
  public static BASE_BOOK_FORMAT_URL: string = `${this.BASE_URL}${this.BOOK_FORMAT_URL}`;

  /////////////////////////////////////////////////////
  // Book genres
  /////////////////////////////////////////////////////
  public static BOOK_GENRE_URL: string = '/book_genres';
  public static BASE_BOOK_GENRE_URL: string = `${this.BASE_URL}${this.BOOK_GENRE_URL}`;

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
