import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Address } from 'src/app/shared/domain/user/address/address';
import { AbstractService } from 'src/app/shared/service/abstract.service';
import { StringValues } from 'src/app/shared/utils/string-values';

@Injectable({
  providedIn: 'root'
})
export class AddressService extends AbstractService<Address, number>{
  constructor(protected override httpClient: HttpClient) {
    super(StringValues.BASE_USER_ADDRESSES_URL, httpClient);
  }
}
