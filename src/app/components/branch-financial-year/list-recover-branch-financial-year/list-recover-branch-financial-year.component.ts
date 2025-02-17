import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { BranchFinancialYearDto } from 'src/app/api/entity/branchFinancialYear';
import { PaginationParams } from 'src/app/api/model/paginationParams';
import { AuthenticationService } from 'src/app/api/service/account/authentication/authentication.service';
import { BranchFinancialYearService } from 'src/app/api/service/devloper/branch-financial-year/branch-financial-year.service';

@Component({
  selector: 'app-list-recover-branch-financial-year',
  templateUrl: './list-recover-branch-financial-year.component.html',
})
export class ListRecoverBranchFinancialYearComponent {

  //#region Property Declaration
  public visible: boolean = false;
  public loading: boolean = false;
  private dialogSub!: Subscription;
  public canDelete: boolean = false;
  public canUpdate: boolean = false;
  subscription!: Subscription;
  public branchFinancialYears: BranchFinancialYearDto[];
  public selectedBranchFinancialYears: BranchFinancialYearDto[];
  public pagination: PaginationParams;
  public cols: any[];
  public totalRecords: number;
  //#endregion 

  //#region constructor
  constructor(
    private branchFinancialYearSvcs: BranchFinancialYearService,
    private authSvcs: AuthenticationService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.visible = false;
    this.loading = false;
    this.dialogSub = new Subscription;
    this.canDelete = this.authSvcs.getUserDetails().permissions.delete;
    this.canUpdate = this.authSvcs.getUserDetails().permissions.update;
    this.subscription = new Subscription;
    this.branchFinancialYears = [];
    this.selectedBranchFinancialYears = [];
    this.pagination = new PaginationParams();
    this.cols = [];
    this.totalRecords = 0;
  }
  //#endregion 

  //#region Lifecycle Hooks
  ngOnInit(): void {
    this.dialogSub = this.branchFinancialYearSvcs.changeRecoverDialogVisibility$.subscribe(
      isVisible => {
        this.visible = isVisible;
        if (isVisible) {
          this.getRemovedBranchFinancialYears(this.pagination);
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
    this.getRemovedBranchFinancialYears(this.pagination);
  }
  onPageChange(event: any) {
    this.pagination.pageNumber = event.first / event.rows;
    this.pagination.pageSize = event.rows;
    this.getRemovedBranchFinancialYears(this.pagination);
  }
  clearSearch() {
    this.pagination.searchTerm = '';
    this.getRemovedBranchFinancialYears(this.pagination);
  }
  //#endregion

  //#region Client Side Operations
  public hideDialog() {
    this.branchFinancialYearSvcs.hideRecoverDialog();
    this.branchFinancialYears = [];
    this.selectedBranchFinancialYears = [];
  }
  //#endregion 

  //#region Server Side Operation
  private getRemovedBranchFinancialYears(pagination: PaginationParams) {
    this.loading = true;
    try {
      this.branchFinancialYearSvcs.getRemoved(pagination).subscribe({
        next: async (response) => {
          this.loading = false;
          if (response.responseCode === 200) {
            this.branchFinancialYears = response.data.collectionObjData as BranchFinancialYearDto[];
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
  public recoverBranchFinancialYear(data: BranchFinancialYearDto) {
    this.branchFinancialYearSvcs.recover(data.branchFinancialYearId).subscribe({
      next: async (response) => {
        if (response.responseCode === 200) {
          this.branchFinancialYears = this.branchFinancialYears.filter(fy => fy.branchFinancialYearId !== data.branchFinancialYearId);
          this.branchFinancialYearSvcs.setRecoverBranchFinancialYear({ branchFinancialYear: data, isSuccess: true, message: response.message });
          this.totalRecords -= 1;
        }
      },
      error: (err) => {
        if (err.error.responseCode === 404) {
          this.branchFinancialYearSvcs.setRecoverBranchFinancialYear({ branchFinancialYear: null, isSuccess: true, message: err.error.message });
        }
        else if (err.error.responseCode === 400) {
          this.branchFinancialYearSvcs.setRecoverBranchFinancialYear({ branchFinancialYear: null, isSuccess: true, message: `Server Side Eroor: ${err.error.message}` });
        }
        else {
          this.branchFinancialYearSvcs.setRecoverBranchFinancialYear({ branchFinancialYear: null, isSuccess: true, message: 'An unknown error occurred.' });
        }
      },
    })
  }
  public deleteBranchFinancialYear(id: string, event: Event) {
    this.confirmationService.confirm({
      key: 'deleteFinancialYear',
      target: event.target || new EventTarget,
      message: 'Are you sure that you want to Delete?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.branchFinancialYearSvcs.delete(id).subscribe({
          next: async (response) => {
            if (response.responseCode === 200) {
              this.branchFinancialYears = this.branchFinancialYears.filter(fy => fy.branchFinancialYearId !== id);
              this.totalRecords -= 1;
            }
          },
          error: (err) => {
            if (err.error.responseCode === 404) {
              this.branchFinancialYearSvcs.setRecoverBranchFinancialYear({ branchFinancialYear: null, isSuccess: true, message: err.error.message });
            }
            else if (err.error.responseCode === 400) {
              this.branchFinancialYearSvcs.setRecoverBranchFinancialYear({ branchFinancialYear: null, isSuccess: true, message: `Server Side Eroor: ${err.error.message}` });
            }
            else {
              this.branchFinancialYearSvcs.setRecoverBranchFinancialYear({ branchFinancialYear: null, isSuccess: true, message: 'An unknown error occurred.' });
            }
          },
        })
      },
      reject: () => { }
    })
  }
  //#endregion 

}
