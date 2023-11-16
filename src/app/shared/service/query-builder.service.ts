import { Injectable } from '@angular/core';

/**
 * A service for building query parameters for HTTP requests.
 * Provides a method to construct a query string from a set of key-value pairs.
 */
@Injectable({
  providedIn: 'root'
})
export class QueryBuilderService {
  /**
   * Builds a query string from the provided key-value pairs.
   * @param params - The key-value pairs to be included in the query string.
   * @returns A string representing the constructed query parameters.
   */
  buildQueryParams(params: Record<string, any>): string {
    // Filter out null or undefined values and construct key-value pairs.
    const queryParams = Object.entries(params)
      .filter(([_, value]) => value != null && value !== undefined)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');

    // Add a leading "?" to the query string if parameters are present.
    return queryParams.length > 0 ? `?${queryParams}` : '';
  }
}
