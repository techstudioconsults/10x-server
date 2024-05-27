
// List of allowed IP addresses from paystack
const allowedIPs = ['52.31.139.75', '52.49.173.169', '52.214.14.220'];

// Middleware to check if the request's IP is whitelisted
const whitelistIP = (req, res, next) => {
  const clientIP = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  if (allowedIPs.includes(clientIP)) {
    next();
  } else {
    res.status(403).send('Access Forbidden');
  }
};
module.exports = whitelistIP;