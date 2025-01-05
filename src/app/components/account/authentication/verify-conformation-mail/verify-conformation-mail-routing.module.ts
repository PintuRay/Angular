import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { VerifyConformationMailComponent } from './verify-conformation-mail.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: VerifyConformationMailComponent }
    ])],
    exports: [RouterModule]
})
export class VerifyConformationMailRoutingModule { }
