export const allowedImageExtensions: string[] = ['jpg', 'jpeg', 'png'];

export const allowedParserExtensions: string[] = ['xlsx'];

/**
 * Validates if a file has a required file type based on its extension.
 * @param file - The File object representing the uploaded file.
 * @param extensions - The allowed extensions for the file.
 * @returns An object with a `requiredFileType` property set to true if the file type is valid, or null otherwise.
 */
export function requiredFileType(file: File | null, extensions: string[]): { requiredFileType: true } | null {
  /**
   * Array of allowed file extensions.
   * @type {string[]}
   */
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
    const isValidExtension: boolean = extensions.includes(extension);

    if (isValidExtension) {
      return {
        requiredFileType: true
      };
    }

    return null;
  }

  return null;
}
