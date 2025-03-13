import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { FinancialYearDto } from 'src/app/api/entity/financialYear';
import { PaginationParams } from 'src/app/api/model/paginationParams';
import { AuthenticationService } from 'src/app/api/service/account/authentication/authentication.service';
import { FinancialYearMessageService } from 'src/app/api/service/devloper/financial-year/financial-year-messsage.service';
import { FinancialYearService } from 'src/app/api/service/devloper/financial-year/financial-year.service';

@Component({
  selector: 'list-recover-financial-year',
  templateUrl: './list-recover-financial-year.component.html',
})
export class ListRecoverFinancialYearComponent {

  //#region Property Declaration
  public visible: boolean = false;
  public loading: boolean = false;
  private dialogSub!: Subscription;
  public canDelete: boolean = false;
  public canCreate: boolean = false;
  public canUpdate: boolean = false;
  public isDevloper: boolean = false;
  subscription!: Subscription;
  public financialYears: FinancialYearDto[];
  public selectedfinancialYears: FinancialYearDto[];
  public pagination: PaginationParams;
  public cols: any[];
  public totalRecords: number = 0;
  private readonly destroy$ = new Subject<void>();
  //#endregion 

  //#region constructor
  constructor(
    private financialYearSvcs: FinancialYearService,
    private authSvcs: AuthenticationService,
    private confirmationService: ConfirmationService,
    private messageService: FinancialYearMessageService,
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
    this.canCreate = this.authSvcs.getUserDetails().permissions.create;
    this.canUpdate = this.authSvcs.getUserDetails().permissions.update;
    this.isDevloper = this.authSvcs.getUserDetails().role.toLowerCase() === "devloper";
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
    this.financialYearSvcs.getRemoved(pagination).pipe(takeUntil(this.destroy$)).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.responseCode === 200) {
          this.financialYears = response.data as FinancialYearDto[];
          this.totalRecords = response.count;
        }
      },
      error: (err) => {
        this.loading = false;
      },
    })

  }
  public recoverFinancialYear(data: FinancialYearDto) {
    this.financialYearSvcs.recover(data.financialYearId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (response) => {
        if (response.responseCode === 200) {
         const recoveredFinancialYear = response.data as FinancialYearDto;
          this.financialYearSvcs.setRecoverFinancialYear({ financialYear: recoveredFinancialYear, isSuccess: true, message: response.message });
          this.hideDialog();
        }
      },
      error: (err) => { }
    })
  }
  public bulkRecoverFinancialYear() {
    this.financialYearSvcs.bulkRecover(this.selectedfinancialYears).pipe(takeUntil(this.destroy$)).subscribe({
      next: (response) => {
        if (response.responseCode == 200) {
          const recoveredFinancialYears = response.data as FinancialYearDto[];
          this.financialYearSvcs.setBulkRecoverFinancialYear({ financialYears: recoveredFinancialYears, isSuccess: true, message: response.message });
          this.hideDialog();
        }
      },
      error: (err) => { }
    })
  }
  public deleteFinancialYear(id: string, event: Event) {
    this.confirmationService.confirm({
      key: 'delete',
      target: event.target || new EventTarget,
      message: 'Are you sure that you want to Delete?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.financialYearSvcs.delete(id).pipe(takeUntil(this.destroy$)).subscribe({
          next: (response) => {
            if (response.responseCode === 200) {
              this.messageService.success(response.message);
              this.hideDialog();
            }
          },
          error: (err) => { }
        })
      },
      reject: () => {
        this.messageService.error('You have rejected');
      }
    })
  }
  public bulkDeleteFinancialYears() {
    this.confirmationService.confirm({
      key: 'bulkDelete',
      accept: () => {
        const financialYearIds = this.selectedfinancialYears.map(fy => fy.financialYearId);
        this.financialYearSvcs.bulkDelete(financialYearIds).pipe(takeUntil(this.destroy$)).subscribe({
          next: (response) => {
            if (response.responseCode === 200) {
              this.messageService.success(response.message);
              this.hideDialog();
            }
          },
          error: (err) => { }
        })
      },
      reject: () => {
        this.messageService.error('You have rejected');
      }
    });
  }
  //#endregion 
}
