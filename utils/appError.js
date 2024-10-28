class AppError extends Error {
  constructor(message, statusCode) {
    super(message); // Call the parent class (Error)
    this.statusCode = statusCode;
    this.name = this.constructor.name; // Set the name to the class name (e.g., 'BadRequestError')
  }
}

module.exports = AppError;
