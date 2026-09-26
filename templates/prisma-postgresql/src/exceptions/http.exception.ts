export class HttpException extends Error {
  public status: number;
  public message: string;
  public data?: unknown;

  constructor(status: number, message: string, data?: unknown) {
    super(message);
    this.status = status;
    this.message = message;
    this.data = data;
    this.name = this.constructor.name;
    Error.captureStackTrace?.(this, this.constructor);
  }
}
