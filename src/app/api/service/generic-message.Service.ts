import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ApiResponse } from './ApiResponse';
import { ValidationError } from './ValidationError';

@Injectable({
  providedIn: 'root'
})
export class GenericMessageService {
  constructor(protected  messageService: MessageService) { }
  public handleApiError(error: any) {
    const errorResponse: ApiResponse = error.error;
    this.messageService.clear();
    switch (errorResponse.responseCode) {
      case 400:
        this.handleBadRequest(errorResponse);
        break;
      case 302:
        this.handleFound(errorResponse);
        break;
      case 404:
        this.handleNotFound(errorResponse);
        break;
      case 401:
        this.handleUnauthorized();
        break;
      case 403:
        this.handleForbidden();
        break;
      case 500:
        this.handleServerError(errorResponse);
        break;
      default:
        this.handleUnexpectedError(error);
        break;
    }
  }
  public success(msg: any) {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: msg });
  }
  public warning(msg: any) {
    this.messageService.add({ severity: 'warn', summary: 'warn', detail: msg });
  }
  public error(msg: string) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: msg });
  }
  protected handleFound(response: ApiResponse) {
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: response.message || 'Resource already exists' }); 
  }
  protected handleNotFound(response: ApiResponse) {
      this.messageService.add({ severity: 'info', summary: 'Not Found', detail: response.message || 'Requested resource not found' });
  }
  private handleUnauthorized() {
    this.messageService.add({ severity: 'error', summary: 'Unauthorized', detail: 'Please login to continue' });
  }
  private handleForbidden() {
    this.messageService.add({ severity: 'error', summary: 'Access Denied', detail: 'You do not have permission to perform this action' });
  }
  private handleServerError(response: ApiResponse) {
    this.messageService.add({ severity: 'error', summary: 'Server Error', detail: response.message || 'An unexpected server error occurred' });
  }
  private handleUnexpectedError(error: any) {
    console.error('Unexpected error:', error);
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An unexpected error occurred. Please try again later.' });
  }
  private handleBadRequest(response: ApiResponse) {
    if (this.isValidationErrorArray(response.data)) {
      const messages = this.formatValidationErrors(response.data);
      this.messageService.addAll(messages);
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message });
    }
  }
  private isValidationErrorArray(data: any): data is ValidationError[] {
    return Array.isArray(data) &&
      data.length > 0 &&
      data.every(item =>
        'errorMessage' in item ||
        'formattedMessagePlaceholderValues' in item
      );
  }
  private formatValidationErrors(errors: ValidationError[]) {
    return errors.map(error => ({ severity: 'error', summary: 'Validation Error', detail: this.formatValidationMessage(error) }));
  }
  private formatValidationMessage(error: ValidationError): string {
    if (error.formattedMessagePlaceholderValues?.PropertyName) {
      return `${error.formattedMessagePlaceholderValues.PropertyName}: ${error.errorMessage}`;
    }
    if (error.propertyName) {
      return `${error.propertyName}: ${error.errorMessage}`;
    }
    return error.errorMessage;
  }
}