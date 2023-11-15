/**
 * Validates if a file has a required file type based on its extension.
 *
 * @param file - The File object representing the uploaded file.
 * @returns An object with a `requiredFileType` property set to true if the file type is valid, or null otherwise.
 *
 * @example
 * const file = new File(["content"], "example.jpg", { type: "image/jpeg" });
 * const validation = requiredFileType(file);
 * // Result: { requiredFileType: true } or null
 */
export function requiredFileType(file: File | null): { requiredFileType: true } | null {
  /**
   * Array of allowed file extensions.
   * @type {string[]}
   */
  const allowedExtensions: string[] = ['jpg', 'jpeg', 'png'];

  if (file) {
    /**
     * The extension of the file, extracted from its name.
     * @type {string}
     */
    const extension: string = file.name.split('.').pop()?.toLowerCase() || '';

    /**
     * Checks if the extension is included in the allowed extensions array.
     * @type {boolean}
     */
    const isValidExtension: boolean = allowedExtensions.includes(extension);

    if (isValidExtension) {
      return {
        requiredFileType: true
      };
    }

    return null;
  }

  return null;
}
