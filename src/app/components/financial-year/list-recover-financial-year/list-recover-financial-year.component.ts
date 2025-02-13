import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { FinancialYearDto } from 'src/app/api/entity/financialYear';
import { PaginationParams } from 'src/app/api/model/paginationParams';
import { AuthenticationService } from 'src/app/api/service/account/authentication/authentication.service';
import { FinancialYearService } from 'src/app/api/service/devloper/financial-year/financial-year.service';

@Component({
  selector: 'app-list-recover-financial-year',
  templateUrl: './list-recover-financial-year.component.html',
})
export class ListRecoverFinancialYearComponent {

  //#region Property Declaration
  public visible: boolean = false;
  public loading: boolean = false;
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
    private authSvcs: AuthenticationService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
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

  //#region Client Side Operations
  public hideDialog() {
    this.financialYearSvcs.hideRecoverDialog();
    this.financialYears = [];
    this.selectedfinancialYears = [];
  }
  //#endregion 
 
  //#region Server Side Operation
  private getRemovedFinancialYears(pagination: PaginationParams) {
    this.loading = true;
    try {
      this.financialYearSvcs.getRemovedFinancialYears(pagination).subscribe({
        next: async (response) => {
          this.loading = false;
          if (response.responseCode === 200) {
            this.financialYears = response.data.collectionObjData as FinancialYearDto[];
            this.totalRecords = response.data.count;
          }
        },
        error: (err) => {
          this.loading = false;
          if (err.error.responseCode === 404) {
            this.messageService.add({ severity: 'info', summary: 'Info', detail: err.error.message });
          }
          else if (err.error.responseCode === 400) {
            this.messageService.add({ severity: 'error', summary: 'error', detail: `Server Side Eroor: ${err.error.message}` });
          }
          else {
            this.messageService.add({ severity: 'error', summary: 'error', detail: 'An unknown error occurred.' });
          }
        },
      })
    }
    catch (error) {
      this.loading = false;
      // this.messageService.add({ severity: 'error', summary: 'error', detail: 'Some Error Occoured' });
    }
  }
  public recoverFinancialYear(data: FinancialYearDto) {
    this.financialYearSvcs.recoverFinancialYear(data.financialYearId).subscribe({
      next: async (response) => {
        if (response.responseCode === 200) {
          this.financialYears = this.financialYears.filter(fy => fy.financialYearId !== data.financialYearId);
          this.financialYearSvcs.setRecoverfinancialYear({ financialYear: data, isSuccess: true, message: response.message });
          this.totalRecords -= 1;
        }
      },
      error: (err) => {
        if (err.error.responseCode === 404) {
          this.financialYearSvcs.setRecoverfinancialYear({ financialYear: null, isSuccess: true, message: err.error.message });
        }
        else if (err.error.responseCode === 400) {
          this.financialYearSvcs.setRecoverfinancialYear({ financialYear: null, isSuccess: true, message: `Server Side Eroor: ${err.error.message}` });
        }
        else {
          this.financialYearSvcs.setRecoverfinancialYear({ financialYear: null, isSuccess: true, message: 'An unknown error occurred.' });
        }
      },
    })
  }
  public deleteFinancialYear(id: string, event: Event) {
    this.confirmationService.confirm({
      key: 'deleteFinancialYear',
      target: event.target || new EventTarget,
      message: 'Are you sure that you want to Delete?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.financialYearSvcs.deleteFinancialYear(id).subscribe({
          next: async (response) => {
            if (response.responseCode === 200) {
              this.financialYears = this.financialYears.filter(fy => fy.financialYearId !== id);
              this.totalRecords -= 1;
            }
          },
          error: (err) => {
            if (err.error.responseCode === 404) {
              this.financialYearSvcs.setRecoverfinancialYear({ financialYear: null, isSuccess: true, message: err.error.message });
            }
            else if (err.error.responseCode === 400) {
              this.financialYearSvcs.setRecoverfinancialYear({ financialYear: null, isSuccess: true, message: `Server Side Eroor: ${err.error.message}` });
            }
            else {
              this.financialYearSvcs.setRecoverfinancialYear({ financialYear: null, isSuccess: true, message: 'An unknown error occurred.' });
            }
          },
        })
      },
      reject: () => { }
    })
  }
  //#endregion 

}
