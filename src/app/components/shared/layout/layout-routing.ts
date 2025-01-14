import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppLayoutComponent } from './app.layout.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
const routes: Routes = [
    {
        path: '',
        component: AppLayoutComponent,
        children: [
            {
                path: 'dashboard',
                loadChildren: () =>
                    import('../../dashboard/dashboard.module').then(
                        (m) => m.DashboardModule
                    ),
            },
            { path: 'user-profile', component: UserProfileComponent },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
        ],
    },
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class LayoutRoutingModule {}
