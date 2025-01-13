import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateFormatDirective } from './date-format.directive';

@NgModule({
  declarations: [
    DateFormatDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    DateFormatDirective
  ]
})
export class FieldsValidationModule {}
