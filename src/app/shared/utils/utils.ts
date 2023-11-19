import { HttpErrorResponse } from "@angular/common/http";
import Swal from "sweetalert2";

// Stores utility functions
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
export function informUserOfError(error: any, isLoading?: boolean){
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
