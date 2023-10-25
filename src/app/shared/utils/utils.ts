import { Router } from "@angular/router";

/**
 * Converts an image file to a Base64-encoded string.
 * @param image - The fil representing thhe image to convert.
 * @param callback - A callback function that will receive the Base64-encoded string.
 */
export function getBase64(image: Blob, callback: (arg0: string | ArrayBuffer | null) => any){
  const reader = new FileReader();

  reader.addEventListener('load', () => callback(reader.result))

  reader.readAsDataURL(image);
}

export function handleErrorStatusResponse(error: any, router: Router){
  switch(error.status){
    case 401:
    case 403:
      router.navigate(['/auth/login']);
      alert("You need to login to continue");
      break;
  }
}
