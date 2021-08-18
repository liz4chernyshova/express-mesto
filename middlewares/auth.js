const jwt = require('jsonwebtoken');
const Error401 = require('../errors/ErrorAuthorization');
const { JWT_SECRET } = require('../utils/key');

const auth = (req, res, next) => {
  const { cookie } = req.headers;

  if (!cookie) {
    next(new Error401('Необходима авторизация.'));
  } else {
    const token = cookie.replace('jwt=', '');
    let payload;

    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      next(new Error401('Авторизация не прошла.'));
    }
    req.user = payload;
    next();
  }
};

module.exports = auth;
