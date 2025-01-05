import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TwostepLoginComponent } from './twostep-login.component';


@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: TwostepLoginComponent }
    ])],
    exports: [RouterModule]
})
export class TwostepLoginRoutingModule { }