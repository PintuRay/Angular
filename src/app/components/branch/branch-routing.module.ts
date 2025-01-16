import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BranchComponent } from './branch.component';
import { ListRecoverBranchComponent } from './list-recover-branch/list-recover-branch.component';
import { ListBranchComponent } from './list-branch/list-branch.component';
@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '', component: BranchComponent, children: [
           { path: 'list-branch', data: { breadcrumb: 'Branch List' }, component: ListBranchComponent },
           { path: 'list-recover-branch', data: { breadcrumb: 'Recover Branch List' }, component: ListRecoverBranchComponent },
           { path: '', redirectTo: 'list-branch', pathMatch: 'full' }
        ]
      },
    ])
  ],
  exports: [RouterModule],
})
export class BranchRoutingModule { }
