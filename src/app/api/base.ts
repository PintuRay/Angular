export class Base {
    exception: any;
    message: string;
    data: any;
    responseCode: number;
  
    constructor(count: string, exception: any, message: string, data: any, responseCode: number) {
      this.exception = exception;
      this.message = message;
      this.data = data;
      this.responseCode = responseCode;
    }
  }