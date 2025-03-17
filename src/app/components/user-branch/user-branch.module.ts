import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimeNgModule } from '../shared/prime-ng/prime-ng.module';
import { FieldsRestrictionModule } from 'src/app/utility/directives/fields-restriction/fields-restriction.module';
import { FieldsValidationModule } from 'src/app/utility/directives/fields-validation/fields-validation.module';
import { FieldsMaskModule } from 'src/app/utility/directives/fields-mask/field-mask.module';
import { UserBranchRoutingModule } from './user-branch-rouing.module';
import { UserBranchComponent } from './user-branch.component';
import { ListUserBranchComponent } from './list-user-branch/list-user-branch.component';
import { AddUpdateUserBranchComponent } from './add-update-user-branch/add-update-user-branch.component';
import { ListRecoverUserBranchComponent } from './list-recover-user-branch/list-recover-user-branch.component';
@NgModule({
  declarations: [
    UserBranchComponent,
    ListUserBranchComponent,
    AddUpdateUserBranchComponent,
    ListRecoverUserBranchComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PrimeNgModule,
    FieldsRestrictionModule,
    FieldsValidationModule,
    FieldsMaskModule,
    UserBranchRoutingModule,
  ],
  providers: [

  ]
})
export class UserBranchModule { }