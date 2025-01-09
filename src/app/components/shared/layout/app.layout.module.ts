import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
// Import components
import { AppLayoutComponent } from './app.layout.component';
import { AppBreadcrumbComponent } from './breadcrumb/app.breadcrumb.component';
import { AppSidebarComponent } from './sidebar/app.sidebar.component';
import { AppTopbarComponent } from './topbar/app.topbar.component';
import { AppProfileSidebarComponent } from './profile/app.profilesidebar.component';
import { AppMenuComponent } from './menu/app.menu.component';
import { AppMenuitemComponent } from './menuitem/app.menuitem.component';
import { AppConfigModule } from './config/app.config.module';
import { LayoutRoutingModule } from './layout-routing';
//Import  ngPrime Modules
import {PrimeNgModule } from '../prime-ng/prime-ng.module';
@NgModule({
    declarations: [
        AppLayoutComponent,
        AppBreadcrumbComponent,
        AppSidebarComponent,
        AppTopbarComponent,
        AppProfileSidebarComponent,
        AppMenuComponent,
        AppMenuitemComponent
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
