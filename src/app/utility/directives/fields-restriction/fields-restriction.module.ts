import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LettersAndSpacesDirective } from './letters-and-spaces.directive';
import { OnlyNumbersDirective } from './only-numbers.directive';
import { PreventNumbersDirective } from './prevent-numbers.directive';
import { PreventSpecialCharactersDirective } from './prevent-special-characters.directive';
import { TransformToUppercaseDirective } from './transform-to-uppercase.directive';
import { OnlyDecimalNumberDirective } from './only-decimal-number.directive';

@NgModule({
  declarations: [
    LettersAndSpacesDirective,
    TransformToUppercaseDirective,
    OnlyNumbersDirective,
    OnlyDecimalNumberDirective,
    PreventNumbersDirective,
    PreventSpecialCharactersDirective,

  ],
  imports: [
    CommonModule
  ],
  exports: [
    LettersAndSpacesDirective,
    TransformToUppercaseDirective,
    OnlyNumbersDirective,
    OnlyDecimalNumberDirective,
    PreventNumbersDirective,
    PreventSpecialCharactersDirective,
  ]
})
export class FieldsRestrictionModule {}
