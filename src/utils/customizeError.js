export class NotFoundError extends Error {
    constructor(message, apiName) {
      super(message); // Call the parent constructor with the message
      this.name = this.constructor.name; // Set the error name to the name of the class
      this.apiName = this.apiName; // Set the error name to the name of the class
      Error.captureStackTrace(this, this.constructor); // Captures the stack trace
    }
}