// utils/customErrors.js

/* eslint-disable max-classes-per-file */

// Base class for custom errors
class AppError extends Error {
  constructor(message, statusCode) {
    super(message); // Call the parent class (Error)
    this.status = statusCode;
    this.name = this.constructor.name; // Set the name to the class name (e.g., 'BadRequestError')
  }
}

// Specific custom error classes
class BadRequestError extends AppError {
  constructor(message = "Bad Request") {
    super(message, 400);
  }
}

class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}

class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super(message, 403);
  }
}

class NotFoundError extends AppError {
  constructor(message = "Not Found") {
    super(message, 404);
  }
}

class ConflictError extends AppError {
  constructor(message = "Conflict") {
    super(message, 409);
  }
}

module.exports = {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
};
