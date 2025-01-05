import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterRoutingModule } from './register-routing.module';

import { RegisterComponent } from './register.component';
import { AppConfigModule } from 'src/app/layout/config/app.config.module';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { AuthenticationService } from 'src/app/api/service/account/authentication/authentication.service';
import { MessageService } from 'primeng/api';
import { CommonService } from 'src/app/api/service/common/common.services';

@NgModule({
    imports: [
        CommonModule,
        RegisterRoutingModule,
        ReactiveFormsModule,
        AppConfigModule,
    ],
    declarations: [RegisterComponent],
    providers: [
        MessageService,
        LayoutService,
        AuthenticationService,
        CommonService,
    ],
})
export class RegisterModule {}
