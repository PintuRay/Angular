import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResendConfirmMailRoutingModule } from './resend-confirm-mail-routing.module';
import { ResendConfirmMailComponent } from './resend-confirm-mail.component';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { AppConfigModule } from 'src/app/layout/config/app.config.module';

@NgModule({
    imports: [
        CommonModule,
        ResendConfirmMailRoutingModule,
        ButtonModule,
        InputTextModule,
        CheckboxModule,
        FormsModule,
        AppConfigModule
    ],
    declarations: [ResendConfirmMailComponent]
})
export class ResendConfirmMailModule { }
