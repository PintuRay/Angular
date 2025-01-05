import { NgModule } from '@angular/core';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppLayoutModule } from './layout/app.layout.module';
import { AuthModule } from './components/account/authentication/auth.module';
import { HttpHeaderInterceptor } from './utility/interceptors/http-header.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

@NgModule({
    declarations: [AppComponent],
    imports: [AppRoutingModule, AuthModule, AppLayoutModule],
    providers: [
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        {provide: HTTP_INTERCEPTORS, useClass: HttpHeaderInterceptor, multi: true},
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
