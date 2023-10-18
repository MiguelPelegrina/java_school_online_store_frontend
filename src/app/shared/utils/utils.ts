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
