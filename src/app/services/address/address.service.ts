import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Address } from 'src/app/shared/domain/user/address/address';
import { AbstractService } from 'src/app/shared/services/abstract/abstract.service';
import { StringValues } from 'src/app/shared/utils/string-values';

/**
 * A service for managing address-related operations.
 * Extends the AbstractService class for common service functionalities.
 */
@Injectable({
  providedIn: 'root'
})
export class AddressService extends AbstractService<Address, number> {
  /**
   * Constructor for the AddressService.
   * @param httpClient - The Angular HttpClient for making HTTP requests.
   */
  constructor(protected override httpClient: HttpClient) {
    super(StringValues.BASE_USER_ADDRESSES_URL, httpClient);
  }
}
