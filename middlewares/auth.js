const jwt = require('jsonwebtoken');
const error401 = require('../errors/ErrorAuthorization');
const { JWT_SECRET } = require('../utils/key');

const auth = (req, res, next) => {
  if (!req.cookies.jwt) {
    next(new error401('Необходима авторизация.'));
  } else {
    const token = req.cookies.jwt;
    let payload;

    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      next(new error401 ('Авторизация не прошла.'));
    }
    req.user = payload;
    next();
  }
};

module.exports = auth;