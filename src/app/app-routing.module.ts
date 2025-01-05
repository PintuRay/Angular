import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { AppLayoutComponent } from './layout/app.layout.component';
import { AuthComponent } from './components/account/authentication/auth.component';
import { authGuard } from './utility/guards/auth.guard';

const routerOptions: ExtraOptions = {
    anchorScrolling: 'enabled',
};

const routes: Routes = [
    {
        path: '',
        redirectTo: 'auth',
        pathMatch: 'full',
    },
    {
        path: 'auth',
        component: AuthComponent,
        children: [
            { path: '', redirectTo: 'login', pathMatch: 'full' },
            {
                path: 'login',
                loadChildren: () =>
                    import(
                        './components/account/authentication/login/login.module'
                    ).then((m) => m.LoginModule),
            },
            {
                path: '2fa/:email',
                loadChildren: () =>
                    import(
                        './components/account/authentication/twostep-login/twostep-login.module'
                    ).then((m) => m.TwostepLoginModule),
            },
            {
                path: 'forgotpassword',
                loadChildren: () =>
                    import(
                        './components/account/authentication/forgot-password/forgot-password.module'
                    ).then((m) => m.ForgotPasswordModule),
            },
            {
                path: 'register',
                loadChildren: () =>
                    import(
                        './components/account/authentication/register/register.module'
                    ).then((m) => m.RegisterModule),
            },
            {
                path: 'reset-password',
                loadChildren: () =>
                    import(
                        './components/account/authentication/reset-password/reset-password.module'
                    ).then((m) => m.ResetPasswordModule),
            },
            {
                path: 'change-password',
                loadChildren: () =>
                    import(
                        './components/account/authentication/change-password/change-password.module'
                    ).then((m) => m.ChangePasswordModule),
            },
            {
                path: 'verify-confirm-password',
                loadChildren: () =>
                    import(
                        './components/account/authentication/verify-conformation-mail/verify-conformation-mail.module'
                    ).then((m) => m.VerifyConformationMailModule),
            },
            {
                path: 'resend-confirm-mail',
                loadChildren: () =>
                    import(
                        './components/account/authentication/resend-confirm-mail/resend-confirm-mail.module'
                    ).then((m) => m.ResendConfirmMailModule),
            },
            {
                path: 'access',
                loadChildren: () =>
                    import(
                        './components/common/accessdenied/accessdenied.module'
                    ).then((m) => m.AccessdeniedModule),
            },
            {
                path: 'error',
                loadChildren: () =>
                    import('./components/common/error/error.module').then(
                        (m) => m.ErrorModule
                    ),
            },
        ],
    },
    {
        path: 'home',
        component: AppLayoutComponent,
        canActivate: [authGuard],
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            {
                path: 'dashboard', 
                loadChildren: () =>
                    import('./components/dashboard/dashboard.module').then(
                        (m) => m.DashboardModule
                    ),
            },
        ],
    },
    {
        path: 'notfound',
        loadChildren: () =>
            import('./components/common/notfound/notfound.module').then(
                (m) => m.NotfoundModule
            ),
    },
    { path: '**', redirectTo: '/notfound' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, routerOptions)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
