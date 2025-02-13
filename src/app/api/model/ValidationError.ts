export interface ValidationError {
  propertyName?: string;
  errorMessage: string;
  formattedMessagePlaceholderValues?: {
    PropertyName: string;
    [key: string]: any;
  };
}