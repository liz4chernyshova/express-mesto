class ErrorAuthorization extends Error {
    constructor(message) {
      super(message);
      this.statusCode = 401;
    }
  }
  
  module.exports = ErrorAuthorization;