require('dotenv/config');
const jwt = require('jsonwebtoken'); // eslint-disable-line
const ClientError = require('./client-error'); // eslint-disable-line

function authorizationMiddleware(req, res, next) {
  /* grabbing token from request header.  */
  const token = req.headers['x-access-token'];
  if (!token) {
    throw new ClientError(401, 'authentication required');
  }
  try {
    /* verify decodes the token and that token contains the user's id and email */
    const payload = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = payload;
    // Move on to the next handler
    next();
  } catch {
    res.status(401).json('Invalid token');
  }
}

module.exports = authorizationMiddleware;
