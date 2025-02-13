import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BranchComponent } from './branch.component';
import { ListBranchComponent } from './list-branch/list-branch.component';
import { AddUpdateBranchComponent } from './add-update-branch/add-update-branch.component';
import { BulkAddUpdateBranchComponent } from './bulk-add-update-branch/bulk-add-update-branch.component';
import { ListRecoverBranchComponent } from './list-recover-branch/list-recover-branch.component';
import { BranchRoutingModule } from './branch-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimeNgModule } from '../shared/prime-ng/prime-ng.module';
import { FieldsRestrictionModule } from 'src/app/utility/directives/fields-restriction/fields-restriction.module';
import { FieldsValidationModule } from 'src/app/utility/directives/fields-validation/fields-validation.module';
import { BranchService } from 'src/app/api/service/devloper/branch/branch.service';
import { BranchMessageService } from '../../api/service/devloper/branch/branch-message.service';

@NgModule({
  declarations: [
    BranchComponent,
    ListBranchComponent,
    AddUpdateBranchComponent,
    BulkAddUpdateBranchComponent,
    ListRecoverBranchComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BranchRoutingModule,
    PrimeNgModule,
    FieldsRestrictionModule,
    FieldsValidationModule
  ],
    providers: [BranchService, BranchMessageService]
})
export class BranchModule { }
