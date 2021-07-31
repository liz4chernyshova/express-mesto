module.exports = {
  "env": {
      "browser": true,
      "es2021": true
  },
  "extends": "airbnb-base",
  "parserOptions": {
      "ecmaVersion": 12
  },
  "rules": {
    'no-underscore-dangle': ['error', { allow: ['_id'] }],
    "allow": ["foo_", "_bar"]
  }
};