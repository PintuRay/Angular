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
import { BulkAddUpdateBranchFinancialYearComponent } from './bulk-add-update-branch-financial-year/bulk-add-update-branch-financial-year.component';
import { ListRecoverBranchFinancialYearComponent } from './list-recover-branch-financial-year/list-recover-branch-financial-year.component';
import { BranchFinancialYearService } from 'src/app/api/service/devloper/branch-financial-year/branch-financial-year.service';
import { BranchService } from 'src/app/api/service/devloper/branch/branch.service';
import { FinancialYearService } from 'src/app/api/service/devloper/financial-year/financial-year.service';

@NgModule({
  declarations: [
    ListBranchFinancialYearComponent,
    AddUpdateBranchFinancialYearComponent,
    BulkAddUpdateBranchFinancialYearComponent,
    BranchFinancialYearComponent,
    ListRecoverBranchFinancialYearComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BranchFinancialYearRoutingModule,
    PrimeNgModule,
    FieldsRestrictionModule,
    FieldsValidationModule
  ],
  providers: [BranchFinancialYearService, BranchService, FinancialYearService]
})
export class BranchFinancialYearModule { }
