import { HttpErrorResponse } from "@angular/common/http";
import Swal from "sweetalert2";

// Stores utility functions
/**
 * Capitalizes the first letter of a given string.
 *
 * @param {string} word - The input string to capitalize the first letter.
 * @returns {string} - The string with the first letter capitalized.
 */
export function capitalizeFirstLetter(word: string) {
  word = word.toLowerCase();

  return word.charAt(0).toUpperCase() + word.slice(1);
}

/**
   * Converts an image file to a Base64-encoded string.
   * @param image - The file representing the image to convert.
   * @param callback - A callback function that will receive the Base64-encoded string.
   */
export function getBase64(image: Blob, callback: (result: string | ArrayBuffer | null) => any): void {
    const reader = new FileReader();

    reader.addEventListener('load', () => callback(reader.result));

    reader.readAsDataURL(image);
}

/**
 * Shows an error that ocurred to the user.
 * @param error - The error response.
 */
export function informUserOfError(error: any){
  console.log(error)
  if(error instanceof HttpErrorResponse){
    if(error.status === 0){
      Swal.fire('An error ocurred', 'Connection to the server failed', 'warning')
    }else {
      Swal.fire('An error ocurred', error.error, 'warning')
    }
    // TODO Not sure about this
  } else {
    Swal.fire('An error ocurred', error.error, 'warning')
  }
}
