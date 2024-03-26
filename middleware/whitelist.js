
// List of allowed IP addresses
const allowedIPs = ['52.31.139.75', '52.49.173.169', '52.214.14.220'];

// Middleware to check if the request's IP is whitelisted
const whitelistIP = (req, res, next) => {
  const clientIP = req.ip || req.connection.remoteAddress;
  if (allowedIPs.includes(clientIP)) {
    next(); // Allow the request to proceed
  } else {
    res.status(403).send('Forbidden'); // Return a 403 Forbidden error for unauthorized IPs
  }
};
module.exports = whitelistIP;