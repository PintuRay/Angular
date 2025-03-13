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
import { FinancialYearMessageService } from 'src/app/api/service/devloper/financial-year/financial-year-messsage.service';
import { BulkAddUpdateFinancialYearComponent } from './bulk-add-update-financial-year/bulk-add-update-financial-year.component';
import { FieldsMaskModule } from 'src/app/utility/directives/fields-mask/field-mask.module';
@NgModule({
  declarations: [
    FinancialYearComponent,
    ListFinancialYearComponent,
    AddUpdateFinancialYearComponent,
    BulkAddUpdateFinancialYearComponent,
    ListRecoverFinancialYearComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FinancialYearRoutingModule,
    PrimeNgModule,
    FieldsRestrictionModule,
    FieldsValidationModule,
    FieldsMaskModule
  ],
  providers: [FinancialYearService, FinancialYearMessageService]
})
export class FinancialYearModule { }