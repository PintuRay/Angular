import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BranchFinancialYearComponent } from './branch-financial-year.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            
            { path: '', data: { breadcrumb: 'Branch Financial Year'}, component: BranchFinancialYearComponent},
        ]),
    ],
    exports: [RouterModule],
})
export class BranchFinancialYearRoutingModule { }
