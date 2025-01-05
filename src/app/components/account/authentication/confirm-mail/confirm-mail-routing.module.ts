import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ConfirmMailComponent } from './confirm-mail.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: ConfirmMailComponent }
    ])],
    exports: [RouterModule]
})
export class ConfirmMailRoutingModule { }
