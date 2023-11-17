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
}
