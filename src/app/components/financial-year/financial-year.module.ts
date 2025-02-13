import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimeNgModule } from '../shared/prime-ng/prime-ng.module';
import { FieldsRestrictionModule } from 'src/app/utility/directives/fields-restriction/fields-restriction.module';
import { FieldsValidationModule } from 'src/app/utility/directives/fields-validation/fields-validation.module';
import { FinancialYearRoutingModule } from './financial-year-routing.module';
import { FinancialYearService } from 'src/app/api/service/devloper/financial-year/financial-year.service';
import { FinancialYearComponent } from './financial-year.component';
import { ListFinancialYearComponent } from './list-financial-year/list-financial-year.component';
import { AddUpdateFinancialYearComponent } from './add-update-financial-year/add-update-financial-year.component';
import { ListRecoverFinancialYearComponent } from './list-recover-financial-year/list-recover-financial-year.component';
@NgModule({
  declarations: [
    FinancialYearComponent,
    ListFinancialYearComponent,
    AddUpdateFinancialYearComponent,
    ListRecoverFinancialYearComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FinancialYearRoutingModule,
    PrimeNgModule,
    FieldsRestrictionModule,
    FieldsValidationModule
  ],
    providers: [FinancialYearService]
})
export class FinancialYearModule { }