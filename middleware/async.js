/**
 *  @author @obajide028 Odesanya Babajide
 *  @version 1.0
 */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
