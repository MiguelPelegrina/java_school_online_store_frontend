import { Router } from "@angular/router";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import { AuthResultDto } from "./interfaces/authResultDto";

export class AuthUtils {
  /**
   * Converts an image file to a Base64-encoded string.
   * @param image - The file representing the image to convert.
   * @param callback - A callback function that will receive the Base64-encoded string.
   */
  static getBase64(image: Blob, callback: (result: string | ArrayBuffer | null) => any): void {
    const reader = new FileReader();

    reader.addEventListener('load', () => callback(reader.result));

    reader.readAsDataURL(image);
  }

  /**
   * Handles HTTP error responses based on status code.
   * @param error - The HTTP error response.
   * @param router - Angular router for navigation.
   */
  static handleErrorStatusResponse(error: any, router: Router): void {
    switch (error.status) {
      case 401:
      case 403:
        router.navigate(['/auth/login']);
        alert("You need to login to continue");
        break;
      default:
        Swal.fire('An error occurred, contact your support', '', 'info');
        break;
    }
  }

  /**
   * Checks if the current user has the "EMPLOYEE" role.
   * @returns True if the user is an employee, otherwise false.
   */
  static isEmployee(): boolean {
    return AuthUtils.getRoles().includes("EMPLOYEE");
  }

  /**
   * Checks if the current user has the "ADMIN" role.
   * @returns True if the user is an admin, otherwise false.
   */
  static isAdmin(): boolean {
    return AuthUtils.getRoles().includes("ADMIN");
  }

  /**
   * Checks if the current user has the "CLIENT" role.
   * @returns True if the user is a client, otherwise false.
   */
  static isClient(): boolean {
    return AuthUtils.getRoles().includes('CLIENT');
  }

  /**
   * Retrieves user roles from the authentication token stored in local storage.
   * @returns An array of user roles.
   */
  static getRoles(): string[] {
    let roles: string[] = [];
    const token = localStorage.getItem('auth_token');

    if (token) {
      const tokenInfo: AuthResultDto = jwtDecode(token);
      roles = tokenInfo.roles;
    }

    return roles;
  }
}
