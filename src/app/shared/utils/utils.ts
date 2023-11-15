import { Router } from "@angular/router";
import Swal from "sweetalert2";

/**
 * Utility functions for common tasks.
 */
export class Utils {
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
}
