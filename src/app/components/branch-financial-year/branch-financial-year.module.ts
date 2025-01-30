import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BranchFinancialYearRoutingModule } from './branch-financial-year-routing.module';
import { PrimeNgModule } from '../shared/prime-ng/prime-ng.module';
import { FieldsRestrictionModule } from 'src/app/utility/directives/fields-restriction/fields-restriction.module';
import { FieldsValidationModule } from 'src/app/utility/directives/fields-validation/fields-validation.module';
import { ListBranchFinancialYearComponent } from './list-branch-financial-year/list-branch-financial-year.component';
import { AddUpdateBranchFinancialYearComponent } from './add-update-branch-financial-year/add-update-branch-financial-year.component';
import { BranchFinancialYearComponent } from './branch-financial-year.component';

@NgModule({
  declarations: [
    ListBranchFinancialYearComponent,
    AddUpdateBranchFinancialYearComponent,
    BranchFinancialYearComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BranchFinancialYearRoutingModule,
    PrimeNgModule,
    FieldsRestrictionModule,
    FieldsValidationModule
  ]
})
export class BranchFinancialYearModule { }
