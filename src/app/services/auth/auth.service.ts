import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from 'src/app/shared/domain/user/user';
import { StringValues } from 'src/app/shared/utils/string-values';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
    })
  };

  constructor(private httpClient: HttpClient) {}

  public login(email: string, password: string){
    const body = JSON.stringify({email, password});

    return this.httpClient.post(
      StringValues.BASE_LOGIN_URL,
      body,
      {headers: this.httpOptions.headers}
    );
  }

  public register(user: User){
    const body = JSON.stringify(user);

    return this.httpClient.post(
      StringValues.BASE_REGISTER_URL,
      body,
      {headers: this.httpOptions.headers}
    )
  }

  public setAuthResultDto(response: any){
    localStorage.setItem('auth_token', response.accessToken);
  }
}
