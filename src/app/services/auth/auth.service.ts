import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from 'src/app/shared/domain/user/user';
import { StringValues } from 'src/app/shared/utils/string-values';

/**
 * A service for handling authentication-related operations.
 * Manages user login, registration, and authentication result storage.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Fields
  httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
    })
  };

  /**
   * Constructor for the AuthService.
   * @param httpClient - The Angular HttpClient for making HTTP requests.
   */
  constructor(private httpClient: HttpClient) {}

  /**
   * Performs user login by sending a POST request with email and password.
   * @param email - The user's email.
   * @param password - The user's password.
   * @returns An Observable representing the login response.
   */
  public login(email: string, password: string){
    const body = JSON.stringify({email, password});

    return this.httpClient.post(
      StringValues.BASE_LOGIN_URL,
      body,
      {headers: this.httpOptions.headers}
    );
  }

  /**
   * Registers a new user by sending a POST request with user details.
   * @param user - The user object containing registration details.
   * @returns An Observable representing the registration response.
   */
  public register(user: User){
    const body = JSON.stringify(user);

    return this.httpClient.post(
      StringValues.BASE_REGISTER_URL,
      body,
      {headers: this.httpOptions.headers}
    )
  }

  /**
   * Sets the authentication result in local storage.
   * @param response - The authentication response containing an access token.
   */
  public setAuthResultDto(response: any){
    localStorage.setItem('auth_token', response.accessToken);
  }
}
