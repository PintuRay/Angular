import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateInputMaskDirective } from './date-mask.directive';


@NgModule({
  declarations: [
    DateInputMaskDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    DateInputMaskDirective
  ]
})
export class FieldsMaskModule {}
