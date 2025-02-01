import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { FinancialYearDto } from 'src/app/api/entity/financialYear';
import { PaginationParams } from 'src/app/api/model/paginationParams';
import { AuthenticationService } from 'src/app/api/service/account/authentication/authentication.service';
import { FinancialYearService } from 'src/app/api/service/devloper/financial-year.service';

@Component({
  selector: 'app-list-recover-financial-year',
  templateUrl: './list-recover-financial-year.component.html',

})
export class ListRecoverFinancialYearComponent {
  //#region Property Declaration
  public visible: boolean = false;
  private dialogSub!: Subscription;
  public canDelete: boolean = false;
  public canUpdate: boolean = false;
  subscription!: Subscription;
  public financialYears: FinancialYearDto[];
  public selectedfinancialYears: FinancialYearDto[];
  public pagination: PaginationParams;
  public cols: any[];
  public totalRecords: number = 0;
  //#endregion 

  //#region constructor
  constructor(
    private financialYearSvcs: FinancialYearService,
    private authSvcs: AuthenticationService
  ) {
    this.financialYears = [];
    this.cols = [];
    this.selectedfinancialYears = [];
    this.pagination = new PaginationParams();
  }
  //#endregion 

  //#region Lifecycle Hooks
  ngOnInit(): void {
    this.canDelete = this.authSvcs.getUserDetails().permissions.delete;
    this.canUpdate = this.authSvcs.getUserDetails().permissions.update;
    this.dialogSub = this.financialYearSvcs.changeRecoverDialogVisibility$.subscribe(
      isVisible => {
        this.visible = isVisible;
        if (isVisible) {
          this.getRemovedFinancialYears(this.pagination);
        }
      }
    );
  }
  ngOnDestroy() {
    this.dialogSub?.unsubscribe();
  }
  //#endregion 
  public hideDialog() {
    this.financialYearSvcs.hideRecoverDialog();
    this.financialYears = [];
    this.selectedfinancialYears = [];
  }
  //#region Pagination , Searching , Shorting
  onGlobalFilter(searchText: HTMLInputElement) {
    this.pagination.searchTerm = searchText.value;
    this.pagination.pageNumber = 0;
    this.getRemovedFinancialYears(this.pagination);
  }
  onPageChange(event: any) {
    this.pagination.pageNumber = event.first / event.rows;
    this.pagination.pageSize = event.rows;
    this.getRemovedFinancialYears(this.pagination);
  }
  clearSearch() {
    this.pagination.searchTerm = '';
    this.getRemovedFinancialYears(this.pagination);
  }
  //#endregion

  //#region Server Side Operation
  private getRemovedFinancialYears(pagination: PaginationParams) {
    try {
      this.financialYearSvcs.getRemovedFinancialYears(pagination).subscribe({
        next: async (response) => {
          if (response.responseCode === 200) {
            this.financialYears = response.data.collectionObjData as FinancialYearDto[];
          }
        },
        error: (response) => { },
      })
    }
    catch (error) {

    }
  }
  public recoverFinancialYear(data: FinancialYearDto) {
    this.financialYearSvcs.recoverFinancialYear(data.financialYearId).subscribe({
      next: async (response) => {
        if (response.responseCode == 200) {
          this.financialYears = this.financialYears.filter(fy => fy.financialYearId !== data.financialYearId);
          this.financialYearSvcs.setRecoverfinancialYear(data, true);
        }
      },
      error: (response) => { },
    })
  }
  public deleteFinancialYear(id: string) {
    this.financialYearSvcs.deleteFinancialYear(id).subscribe({
      next: async (response) => {
        if (response.responseCode == 200) {
          this.financialYears = this.financialYears.filter(fy => fy.financialYearId !== id);

        }
      },
      error: (response) => { },
    })
  }
  //#endregion 
}
