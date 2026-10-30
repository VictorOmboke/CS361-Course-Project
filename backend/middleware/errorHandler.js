//  Application error handling class
class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;

    // Differentiate between user errors and dev errors
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";

    // Only focus on operational errors, not programmer errors
    this.isOperational = true;

    // Capture stack trace, exclude constructor call
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
