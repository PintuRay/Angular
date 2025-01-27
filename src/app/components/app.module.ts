import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HashLocationStrategy, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpHeaderInterceptor } from '../utility/interceptors/http-header.interceptor';
import { ConfirmationService, MessageService } from 'primeng/api';
@NgModule({
    declarations: [AppComponent],
    imports: [ BrowserModule, BrowserAnimationsModule,HttpClientModule,AppRoutingModule],
    providers: [
        { provide: LocationStrategy, useClass: PathLocationStrategy },
        {provide: HTTP_INTERCEPTORS, useClass: HttpHeaderInterceptor, multi: true},
        ConfirmationService,
        MessageService,
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
