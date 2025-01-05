import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerifyConformationMailRoutingModule } from './verify-conformation-mail-routing.module';
import { VerifyConformationMailComponent } from './verify-conformation-mail.component';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { AppConfigModule } from 'src/app/layout/config/app.config.module';

@NgModule({
    imports: [
        CommonModule,
        VerifyConformationMailRoutingModule,
        FormsModule, 
        ButtonModule,
        InputTextModule,
        CheckboxModule,     
        AppConfigModule 
    ],
    declarations: [VerifyConformationMailComponent]
})
export class VerifyConformationMailModule { }
