import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ResendConfirmMailComponent } from './resend-confirm-mail.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: ResendConfirmMailComponent }
    ])],
    exports: [RouterModule]
})
export class ResendConfirmMailRoutingModule { }
