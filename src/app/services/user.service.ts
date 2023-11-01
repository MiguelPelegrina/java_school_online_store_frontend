import { Injectable } from '@angular/core';
import { AbstractService } from '../shared/service/abstract.service';
import { User } from '../shared/domain/user/user';
import { HttpClient } from '@angular/common/http';
import { StringValues } from '../shared/utils/string-values';

@Injectable({
  providedIn: 'root'
})
export class UserService extends AbstractService<User, number>{

  constructor(protected override httpClient: HttpClient) {
    super(StringValues.BASE_USER_URL, httpClient);
  }
}
