import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FinancialYearComponent } from './financial-year.component';
import { ListFinancialYearComponent } from './list-financial-year/list-financial-year.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '', component: FinancialYearComponent,
                children: [
                    {path: 'list-financial-year', data: { breadcrumb: 'Financial Year List' }, component: ListFinancialYearComponent},
                    { path: '', redirectTo: 'list-financial-year', pathMatch: 'full' }
                ],
            },
        ]),
    ],
    exports: [RouterModule],
})
export class FinancialYearRoutingModule { }
