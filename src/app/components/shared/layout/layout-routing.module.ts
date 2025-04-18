import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppLayoutComponent } from './app.layout.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { deactivateGuard } from 'src/app/utility/guards/deactivate.guard';
const routes: Routes = [
    {
        path: '',
        component: AppLayoutComponent,
        children: [
            { path: 'user-profile', component: UserProfileComponent , canDeactivate: [deactivateGuard]},
            {
                path: 'dashboard', data: { breadcrumb: 'Dashboard' },
                loadChildren: () =>
                    import('../../dashboard/dashboard.module').then(
                        (m) => m.DashboardModule
                    ),
            },
            {
                path: 'branch', data: { breadcrumb: 'Branch' },
                loadChildren: () =>
                    import('../../branch/branch.module').then(
                        (m) => m.BranchModule
                    ),
            },
            {
                path: 'financial-year', data: { breadcrumb: 'financial-year' },
                loadChildren: () =>
                    import('../../financial-year/financial-year.module').then(
                        (m) => m.FinancialYearModule
                    ),
            },
            {
                path: 'user-branch', data: { breadcrumb: 'user-branch' },
                loadChildren: () =>
                    import('../../user-branch/user-branch.module').then(
                        (m) => m.UserBranchModule
                    ),
            },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
        ],
    },
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class LayoutRoutingModule { }
