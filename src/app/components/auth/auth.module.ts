import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthRoutingModule } from './auth-routing.module';
// Import components
import { AuthComponent } from './auth.component';
import { LoginComponent } from './authentication/login/login.component';
import { RegisterComponent } from './authentication/register/register.component';
import { ForgotPasswordComponent } from './authentication/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './authentication/reset-password/reset-password.component';
import { ConfirmMailComponent } from './authentication/confirm-mail/confirm-mail.component';
import { TwostepLoginComponent } from './authentication/twostep-login/twostep-login.component';
import { VerifyConformationMailComponent } from './authentication/verify-conformation-mail/verify-conformation-mail.component';
import { ResendConfirmMailComponent } from './authentication/resend-confirm-mail/resend-confirm-mail.component';
//Import  ngPrime Modules
import {PrimeNgModule} from '../shared/prime-ng/prime-ng.module'
//Import  Field Restriction & Validation Modules
import {FieldsRestrictionModule} from '../../utility/directives/fields-restriction/fields-restriction.module';
import {FieldsValidationModule} from '../../utility/directives/fields-validation/fields-validation.module'
//import Services
import { AuthenticationService } from '../../api/service/account/authentication/authentication.service';
import { GenericMessageService } from 'src/app/api/service/generic-message.Service';
import { FieldsMaskModule } from 'src/app/utility/directives/fields-mask/field-mask.module';

@NgModule({
  declarations: [
    AuthComponent,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    ConfirmMailComponent,
    TwostepLoginComponent,
    VerifyConformationMailComponent,
    ResendConfirmMailComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AuthRoutingModule,
    PrimeNgModule,
    FieldsRestrictionModule,
    FieldsValidationModule,
    FieldsMaskModule
  ],
  providers: [AuthenticationService, GenericMessageService]
})
export class AuthModule { }