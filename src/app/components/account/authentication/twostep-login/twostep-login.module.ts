import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppConfigModule } from 'src/app/layout/config/app.config.module';
import { TwostepLoginComponent } from './twostep-login.component';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { AuthenticationService } from 'src/app/api/service/account/authentication/authentication.service';
import { TwostepLoginRoutingModule } from './twostep-login.routing.module';
import { InputOtpModule } from 'primeng/inputotp';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
@NgModule({
    imports: [
        CommonModule,
        AppConfigModule,
        TwostepLoginRoutingModule,
        InputOtpModule,
        ButtonModule,
        ToastModule,
        FormsModule
    ],
    declarations: [TwostepLoginComponent],
    providers: [
        LayoutService,
        AuthenticationService,
        MessageService,
    ]
})
export class TwostepLoginModule { }
