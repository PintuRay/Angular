import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
// Import components
import { AppLayoutComponent } from './app.layout.component';
import { AppSidebarComponent } from './sidebar/app.sidebar.component';
import { AppTopbarComponent } from './topbar/app.topbar.component';
import { AppProfileSidebarComponent } from './profile/app.profilesidebar.component';
import { AppMenuComponent } from './menu/app.menu.component';
import { AppMenuitemComponent } from './menuitem/app.menuitem.component';
import { VerifyTwoFactorTokenComponent } from './topbar/verify-two-factor-token/verify-two-factor-token.component';
import { ChangePasswordComponent } from './topbar/change-password/change-password.component';
import { AppConfigModule } from './config/app.config.module';
import { LayoutRoutingModule } from './layout-routing';
//Import  ngPrime Modules
import {PrimeNgModule } from '../prime-ng/prime-ng.module';

@NgModule({
    declarations: [
        AppLayoutComponent,
        AppSidebarComponent,
        AppTopbarComponent,
        AppProfileSidebarComponent,
        AppMenuComponent,
        AppMenuitemComponent,
        ChangePasswordComponent,
        VerifyTwoFactorTokenComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
        LayoutRoutingModule,
        RouterModule,
        AppConfigModule, 
        PrimeNgModule
    ]
})
export class AppLayoutModule { }
