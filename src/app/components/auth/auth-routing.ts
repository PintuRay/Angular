import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './authentication/login/login.component';
import { RegisterComponent } from './authentication/register/register.component';
import { ForgotPasswordComponent } from './authentication/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './authentication/reset-password/reset-password.component';
import { ConfirmMailComponent } from './authentication/confirm-mail/confirm-mail.component';
import { TwostepLoginComponent } from './authentication/twostep-login/twostep-login.component';
import { ResendConfirmMailComponent } from './authentication/resend-confirm-mail/resend-confirm-mail.component';
import { VerifyConformationMailComponent } from './authentication/verify-conformation-mail/verify-conformation-mail.component';
// Import other auth components...

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      { path: 'login/:message', component: LoginComponent },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent },
      { path: 'reset-password/:uid/:token', component: ResetPasswordComponent },
      { path: 'confirm-mail/:message', component: ConfirmMailComponent },
      { path: 'twostep-login/:email', component: TwostepLoginComponent },
      { path: 'verify-confirmation-mail/:uid/:token', component: VerifyConformationMailComponent },
      { path: 'resend-confirm-mail', component: ResendConfirmMailComponent },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }