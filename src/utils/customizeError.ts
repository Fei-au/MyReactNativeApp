export class NotFoundError extends Error {
    constructor(message: string) {
      super(message); // Call the parent constructor with the message
      this.name = this.constructor.name; // Set the error name to the name of the class
      Error.captureStackTrace(this, this.constructor); // Captures the stack trace
    }
}

export class AuthFailedError extends Error {
  constructor(message: string) {
    super(message); // Call the parent constructor with the message
    this.name = this.constructor.name; // Set the error name to the name of the class
    Error.captureStackTrace(this, this.constructor); // Captures the stack trace
  }
}