export const DATE_FORMAT = 'DD-MM-YYYY';

export const ANIMATION_DURATION = '225ms cubic-bezier(0.4, 0.0, 0.2, 1)';

/**
 * Class containing all default values and shared URLs.
 */
export class StringValues{
  public static BASE_URL = 'http://localhost:8081';
  public static DOCUMENTATION = 'https://miguelpelegrina.github.io/java_school_online_store_documentation/';

  /////////////////////////////////////////////////////
  // Authentication
  /////////////////////////////////////////////////////
  private static AUTH_URL = '/auth';
  private static LOGIN_URL = '/login'
  private static REGISTER_URL = '/register'
  public static BASE_LOGIN_URL = `${this.BASE_URL}${this.AUTH_URL}${this.LOGIN_URL}`
  public static BASE_REGISTER_URL = `${this.BASE_URL}${this.AUTH_URL}${this.REGISTER_URL}`

  /////////////////////////////////////////////////////
  // Books
  /////////////////////////////////////////////////////
  public static BOOK_URL = '/books';
  public static BASE_BOOK_URL = `${this.BASE_URL}${this.BOOK_URL}`;

  /////////////////////////////////////////////////////
  // Book formats
  /////////////////////////////////////////////////////
  public static BOOK_FORMAT_URL = '/book_parameters_format';
  public static BASE_BOOK_FORMAT_URL = `${this.BASE_URL}${this.BOOK_FORMAT_URL}`;

  /////////////////////////////////////////////////////
  // Book genres
  /////////////////////////////////////////////////////
  public static BOOK_GENRE_URL = '/book_genres';
  public static BASE_BOOK_GENRE_URL = `${this.BASE_URL}${this.BOOK_GENRE_URL}`;

  //////////////////////////////////////////////////////
  // Cities
  //////////////////////////////////////////////////////
  public static CITIES_URL = '/cities';
  public static BASE_CITY_URL = `${this.BASE_URL}${this.CITIES_URL}`;

  //////////////////////////////////////////////////////
  // Countries
  //////////////////////////////////////////////////////
  public static COUNTRY_URL = '/countries';
  public static BASE_COUNTRY_URL = `${this.BASE_URL}${this.COUNTRY_URL}`;

  /////////////////////////////////////////////////////
  // Delivery methods
  /////////////////////////////////////////////////////
  public static DELIVERY_METHODS_URL = '/delivery_methods';
  public static BASE_DELIVERY_METHODS_URL = `${this.BASE_URL}${this.DELIVERY_METHODS_URL}`;

  /////////////////////////////////////////////////////
  // Order statuses
  /////////////////////////////////////////////////////
  public static ORDER_STATUSES_URL = '/order_statuses';
  public static BASE_ORDER_STATUSES_URL = `${this.BASE_URL}${this.ORDER_STATUSES_URL}`;

  /////////////////////////////////////////////////////
  // Orders
  /////////////////////////////////////////////////////
  public static ORDER_URL = '/orders';
  public static BASE_ORDER_URL = `${this.BASE_URL}${this.ORDER_URL}`;

  /////////////////////////////////////////////////////
  // Payment methods
  /////////////////////////////////////////////////////
  public static PAYMENT_METHODS_URL = '/payment_methods';
  public static BASE_PAYMENT_METHODS_URL = `${this.BASE_URL}${this.PAYMENT_METHODS_URL}`;

  /////////////////////////////////////////////////////
  // Payment statuses
  /////////////////////////////////////////////////////
  public static PAYMENT_STATUS_URL = '/payment_statuses';
  public static BASE_PAYMENT_STATUS_URL = `${this.BASE_URL}${this.PAYMENT_STATUS_URL}`;

  /////////////////////////////////////////////////////
  // Postal codes
  /////////////////////////////////////////////////////
  public static POSTAL_CODE_URL = '/postal_codes';
  public static BASE_POSTAL_CODE_URL = `${this.BASE_URL}${this.POSTAL_CODE_URL}`;

  /////////////////////////////////////////////////////
  // User address
  /////////////////////////////////////////////////////
  public static USERS_URL = '/users';
  public static BASE_USER_URL = `${this.BASE_URL}${this.USERS_URL}`;

  /////////////////////////////////////////////////////
  // User address
  /////////////////////////////////////////////////////
  public static USER_ADDRESSES_URL = '/user_addresses';
  public static BASE_USER_ADDRESSES_URL = `${this.BASE_URL}${this.USER_ADDRESSES_URL}`;

  /////////////////////////////////////////////////////
  // Default values
  ////////////////////////////////////////////////////
  public static DEFAULT_ORDER_STATUS_ON_ORDER = 'Pending payment';
  public static DEFAULT_PAGE_SIZE = 12;
  public static DEFAULT_PAGE_SIZE_OPTIONS = [1, 3, 6, 9, 12, 24, 36];
  public static DEFAULT_PAYMENT_STATUS_ON_ORDER = 'Pending';
}
