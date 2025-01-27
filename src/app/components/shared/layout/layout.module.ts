import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
// Import components
import { AppLayoutComponent } from './app.layout.component';
import { AppSidebarComponent } from './sidebar/app.sidebar.component';
import { AppTopbarComponent } from './topbar/app.topbar.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { AppMenuComponent } from './menu/app.menu.component';
import { AppMenuitemComponent } from './menuitem/app.menuitem.component';
import { VerifyTwoFactorTokenComponent } from './topbar/verify-two-factor-token/verify-two-factor-token.component';
import { ChangePasswordComponent } from './topbar/change-password/change-password.component';
import { AppConfigModule } from './config/app.config.module';
import { LayoutRoutingModule } from './layout-routing.module';
//Import  ngPrime Modules
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { FieldsRestrictionModule } from 'src/app/utility/directives/fields-restriction/fields-restriction.module';
import { FieldsValidationModule } from 'src/app/utility/directives/fields-validation/fields-validation.module';
import { LayoutService } from '../service/app.layout.service';
import { MenuService } from '../service/app.menu.service';
import { TopBarService } from '../service/topbar.service';


@NgModule({
    declarations: [
        AppLayoutComponent,
        AppSidebarComponent,
        AppTopbarComponent,
        UserProfileComponent,
        AppMenuComponent,
        AppMenuitemComponent,
        ChangePasswordComponent,
        VerifyTwoFactorTokenComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        LayoutRoutingModule,
        RouterModule,
        AppConfigModule,
        PrimeNgModule,
        FieldsRestrictionModule,
        FieldsValidationModule
    ],
    providers:[LayoutService, MenuService, TopBarService]
})
export class AppLayoutModule { }
