import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResetPasswordRoutingModule } from './reset-password-routing.module';
import { ResetPasswordComponent } from './reset-password.component';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { AppConfigModule } from 'src/app/layout/config/app.config.module';

@NgModule({
    imports: [
        CommonModule,
        ResetPasswordRoutingModule,
        FormsModule,
        ButtonModule,
        InputTextModule,
        CheckboxModule,
        AppConfigModule
    ],
    declarations: [ResetPasswordComponent]
})
export class ResetPasswordModule { }
