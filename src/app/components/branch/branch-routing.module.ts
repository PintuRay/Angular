import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BranchComponent } from './branch.component';
import { ListRecoverBranchComponent } from './list-recover-branch/list-recover-branch.component';
import { ListBranchComponent } from './list-branch/list-branch.component';
import { BulkAddUpdateBranchComponent } from './bulk-add-update-branch/bulk-add-update-branch.component';
import { AddUpdateBranchComponent } from './add-update-branch/add-update-branch.component';
@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '', component: BranchComponent, children: [
           { path: 'list-branch', data: { breadcrumb: 'Branch' }, component: ListBranchComponent },
           { path: 'list-recover', data: { breadcrumb: 'Branch' }, component: ListRecoverBranchComponent },
           { path: 'add-update', data: { breadcrumb: 'Branch' }, component: AddUpdateBranchComponent },
           { path: 'bulk-add-update', data: { breadcrumb: 'Branch' }, component: BulkAddUpdateBranchComponent },
           { path: '', redirectTo: 'list-branch', pathMatch: 'full' }
        ]
      },
    ])
  ],
  exports: [RouterModule],
})
export class BranchRoutingModule { }
