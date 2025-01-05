import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmMailRoutingModule } from './confirm-mail-routing.module';
import { ConfirmMailComponent } from './confirm-mail.component';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { AppConfigModule } from 'src/app/layout/config/app.config.module';

@NgModule({
    imports: [
        CommonModule,
        ConfirmMailRoutingModule,
        ButtonModule,
        InputTextModule,
        CheckboxModule,
        FormsModule,
        AppConfigModule
    ],
    declarations: [ConfirmMailComponent]
})
export class ConfirmMailModule { }
