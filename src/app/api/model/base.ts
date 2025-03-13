export class Base {
  exception: any;
  message: string;
  data: any;
  responseCode: number;
  count: number;
  constructor(exception: any, message: string, data: any, responseCode: number, count: number) {
    this.exception = exception;
    this.message = message;
    this.data = data;
    this.responseCode = responseCode;
    this.count = count;
  }
}