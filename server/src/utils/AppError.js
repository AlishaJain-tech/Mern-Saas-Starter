// A custom Error class that carries an HTTP status code with it.
//
// Why we need this:
// Normal JS `Error` objects only have a `.message`. But in an API,
// every error also needs a status code (404, 400, 401, etc).
// This class lets us do: `throw new AppError("User not found", 404)`
// and our global error handler will know exactly what to send back.
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;

    // Marks this as an error we intentionally threw (a "known" error),
    // as opposed to a random bug/crash. Useful later for logging/monitoring.
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;