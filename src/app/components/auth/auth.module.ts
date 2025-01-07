import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthRoutingModule } from './auth-routing';
// Import components
import { AuthComponent } from './auth.component';
import { LoginComponent } from './authentication/login/login.component';
import { RegisterComponent } from './authentication/register/register.component';
import { ForgotPasswordComponent } from './authentication/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './authentication/reset-password/reset-password.component';
import { ConfirmMailComponent } from './authentication/confirm-mail/confirm-mail.component';
import { TwostepLoginComponent } from './authentication/twostep-login/twostep-login.component';
import { VerifyConformationMailComponent } from './authentication/verify-conformation-mail/verify-conformation-mail.component';
import { ChangePasswordComponent } from './authentication/change-password/change-password.component';
import { ResendConfirmMailComponent } from './authentication/resend-confirm-mail/resend-confirm-mail.component';
//Import  ngPrime Modules
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { InputOtpModule } from 'primeng/inputotp';
import {StepsModule} from 'primeng/steps';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CalendarModule } from 'primeng/calendar';
import { ChipsModule } from 'primeng/chips';
import { ChipModule } from 'primeng/chip';
import { DropdownModule } from 'primeng/dropdown';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { CascadeSelectModule } from 'primeng/cascadeselect';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RatingModule } from 'primeng/rating';
import { KnobModule } from 'primeng/knob';
import { ListboxModule } from 'primeng/listbox';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputSwitchModule } from 'primeng/inputswitch';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ColorPickerModule } from 'primeng/colorpicker';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { SliderModule } from 'primeng/slider';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
//import Services
import { MessageService } from 'primeng/api';
import { LayoutService } from '../shared/service/app.layout.service';
import { AuthenticationService } from '../../api/service/account/authentication/authentication.service';
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
    ChangePasswordComponent,
    ResendConfirmMailComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AuthRoutingModule,
    InputTextModule,
    ButtonModule,
    CheckboxModule,
    PasswordModule,
    ToastModule,
    InputOtpModule,
    StepsModule
  ],
  providers: [
    MessageService,
    LayoutService,
    AuthenticationService, 
]
})
export class AuthModule { }