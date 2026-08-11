/**
 * Custom application HTTP error class.
 */
export class HttpError extends Error {
  /**
   * @param {number} statusCode - HTTP status code (e.g. 400, 401, 403, 404, 500)
   * @param {string} message - Human-readable error description
   * @param {string} [code='ERROR'] - Machine-readable error code string
   */
  constructor(statusCode, message, code = 'ERROR') {
    super(message);
    this.name = 'HttpError';
    this.statusCode = statusCode;
    this.code = code;
  }
}
