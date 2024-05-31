/**
 *  @author @obajide028 Odesanya Babajide
 *  @version 1.0
 */

class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

module.exports = ErrorResponse;
