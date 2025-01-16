import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppLayoutComponent } from './app.layout.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
const routes: Routes = [
    {
        path: '',
        component: AppLayoutComponent,
        children: [
            { path: 'user-profile', component: UserProfileComponent },
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
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
        ],
    },
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class LayoutRoutingModule {}
