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
//Import  ngPrime Modules
import { AppConfigModule } from './config/app.config.module';
import { LayoutRoutingModule } from './layout-routing';
import { ButtonModule } from 'primeng/button';
import { StyleClassModule } from 'primeng/styleclass';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { SidebarModule } from 'primeng/sidebar';
import { BadgeModule } from 'primeng/badge';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TooltipModule } from 'primeng/tooltip';
import { RippleModule } from 'primeng/ripple';

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
        InputTextModule,
        SidebarModule,
        BadgeModule,
        RadioButtonModule,
        InputSwitchModule,
        ButtonModule,
        TooltipModule,
        RippleModule,
        RouterModule,
        AppConfigModule,
        StyleClassModule,
        CalendarModule,    
    ]
})
export class AppLayoutModule { }
