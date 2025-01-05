import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { MessageService } from 'primeng/api';
import { ReactiveFormsModule  } from '@angular/forms';
import { AppConfigModule } from 'src/app/layout/config/app.config.module';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { AuthenticationService } from 'src/app/api/service/account/authentication/authentication.service';

@NgModule({
    imports: [
        CommonModule,
        LoginRoutingModule,
        ReactiveFormsModule ,
        AppConfigModule
    ],
    declarations: [LoginComponent],
    providers: [
        MessageService,
        LayoutService,
        AuthenticationService, 
    ]
})
export class LoginModule { }
