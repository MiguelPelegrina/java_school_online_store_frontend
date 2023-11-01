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
  // Cities
  //////////////////////////////////////////////////////
  public static CITIES_URL: string = '/cities';
  public static BASE_CITY_URL: string = `${this.BASE_URL}${this.CITIES_URL}`;

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

  /////////////////////////////////////////////////////
  // Postal codes
  /////////////////////////////////////////////////////
  public static POSTAL_CODE_URL: string = '/postal_codes';
  public static BASE_POSTAL_CODE_URL: string = `${this.BASE_URL}${this.POSTAL_CODE_URL}`;

  /////////////////////////////////////////////////////
  // User address
  /////////////////////////////////////////////////////
  public static USERS_URL: string = '/users';
  public static BASE_USER_URL: string = `${this.BASE_URL}${this.USERS_URL}`;

  /////////////////////////////////////////////////////
  // User address
  /////////////////////////////////////////////////////
  public static USER_ADDRESSES_URL: string = '/user_addresses';
  public static BASE_USER_ADDRESSES_URL: string = `${this.BASE_URL}${this.USER_ADDRESSES_URL}`;


}
