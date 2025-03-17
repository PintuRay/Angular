import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserBranchComponent } from './user-branch.component';
import { ListUserBranchComponent } from './list-user-branch/list-user-branch.component';


@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '', component: UserBranchComponent,
                children: [
                    {path: 'list-user-branch', data: { breadcrumb: 'User Branch List' }, component: ListUserBranchComponent},
                    { path: '', redirectTo: 'list-financial-year', pathMatch: 'full' }
                ],
            },
        ]),
    ],
    exports: [RouterModule],
})
export class UserBranchRoutingModule { }
