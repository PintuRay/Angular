import { Component, ComponentFactoryResolver, ComponentRef, ViewContainerRef } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { BulkFinancialYearOperation, FinancialYearDto, FinancialYearOperation } from 'src/app/api/entity/financialYear';
import { PaginationParams } from 'src/app/api/model/paginationParams';
import { AuthenticationService } from 'src/app/api/service/account/authentication/authentication.service';
import { FinancialYearMessageService } from 'src/app/api/service/devloper/financial-year/financial-year-messsage.service';
import { FinancialYearService } from 'src/app/api/service/devloper/financial-year/financial-year.service';
import { ListRecoverFinancialYearComponent } from '../list-recover-financial-year/list-recover-financial-year.component';
import { AddUpdateFinancialYearComponent } from '../add-update-financial-year/add-update-financial-year.component';
import { BulkAddUpdateFinancialYearComponent } from '../bulk-add-update-financial-year/bulk-add-update-financial-year.component';

@Component({
  selector: 'app-list-financial-year',
  templateUrl: './list-financial-year.component.html',
  styles: `
  :host ::ng-deep {
      .p-paginator {
          .p-dropdown {
              height: 2.5rem;
              .p-dropdown-label {
                  padding-right: 0.5rem;
              }
          } 
          .p-dropdown-items-wrapper {
              max-height: 200px;
          }
      } 
      .p-dropdown-panel {
          .p-dropdown-items {
              padding: 0.5rem 0;
              .p-dropdown-item {
                  padding: 0.5rem 1rem;
                  margin: 0;
                  &:hover {
                      background: var(--surface-200);
                  }
              }
          }
      }
  }
`
})
export class ListFinancialYearComponent {
  //#region Property Declaration
  public display: boolean = false;
  public loading: boolean = false;
  public canDelete: boolean = false;
  public canCreate: boolean = false;
  public canUpdate: boolean = false;
  public isDevloper: boolean = false;
  public financialYears: FinancialYearDto[] = [];
  public selectedfinancialYears: FinancialYearDto[] = [];
  public pagination: PaginationParams = new PaginationParams();
  public cols: any[] = [];
  public totalRecords: number = 0;
  private readonly destroy$ = new Subject<void>();
  private componentRef: ComponentRef<any> | null = null;
  //#endregion 

  //#region constructor
  constructor(
    private financialYearSvcs: FinancialYearService,
    private authSvcs: AuthenticationService,
    private confirmationService: ConfirmationService,
    private messageService: FinancialYearMessageService,
    private viewContainerRef: ViewContainerRef,
  ) { }
  //#endregion 

  //#region Lifecycle Hooks
  ngOnInit(): void {
    this.canDelete = this.authSvcs.getUserDetails().permissions.delete;
    this.canCreate = this.authSvcs.getUserDetails().permissions.create;
    this.canUpdate = this.authSvcs.getUserDetails().permissions.update;
    this.isDevloper = this.authSvcs.getUserDetails().role.toLowerCase() === "devloper";
    this.getFinancialYears(this.pagination);
    this.setupSubscriptions();
  }
  ngOnDestroy(): void {
    // This will automatically unsubscribe from all subscriptions using takeUntil
    this.destroy$.next();
    this.destroy$.complete();
    if (this.componentRef) {
      this.componentRef.destroy();
    }
  }
  //#endregion

  //#region Subscription
  private setupSubscriptions(): void {
    // Single Insert or Update
    this.financialYearSvcs.getFinancialYear()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        operation => this.handleAddUpdateOperation(operation)
      );
    // Bulk Insert or Update
    this.financialYearSvcs.getBulkFinancialYear()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        operation => this.handleBulkAddUpdateOperation(operation)
      );
    // Single Recover
    this.financialYearSvcs.getRecoverFinancialYear()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        operation => this.handleRecoverOperation(operation)
      );
    // Bulk Recover
    this.financialYearSvcs.getBulkRecoverFinancialYear()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        operation => this.handleBulkRecoverOperation(operation)
      );
  }
  private handleAddUpdateOperation(operation: FinancialYearOperation | null): void {
    if (operation?.isSuccess) {
      if (operation.financialYear) {
        const index = this.financialYears.findIndex(item => item.financialYearId === operation.financialYear?.financialYearId);
        if (index !== -1) {
          // Update existing record
          this.financialYears[index] = operation.financialYear;
        } else {
          // Add new record
          this.financialYears = [...this.financialYears, operation.financialYear];
          this.totalRecords += 1;
        }
      }
      this.messageService.success(operation.message);
    }
  }
  private handleBulkAddUpdateOperation(operation: BulkFinancialYearOperation | null): void {
    if (operation?.isSuccess) {
      if (operation.financialYears && operation.financialYears.length > 0) {
        let recordsAdded = 0;
        operation.financialYears.forEach(financialYear => {
          const index = this.financialYears.findIndex(item => item.financialYearId === financialYear.financialYearId);
          if (index !== -1) {
            // Update existing record
            this.financialYears[index] = financialYear;
          } else {
            // Add new record
            this.financialYears.push(financialYear);
            recordsAdded++;
          }
        });
        // Update total records and trigger change detection
        this.totalRecords += recordsAdded;
        this.financialYears = [...this.financialYears];
      }
      this.messageService.success(operation.message);
    }
  }
  private handleRecoverOperation(operation: FinancialYearOperation | null): void {
    if (operation?.isSuccess) {
      if (operation.financialYear) {
        this.financialYears = [...this.financialYears, operation.financialYear];
        this.totalRecords += 1;
      }
      this.messageService.success(operation.message);
    }
  }
  private handleBulkRecoverOperation(operation: BulkFinancialYearOperation | null): void {
    if (operation?.isSuccess) {
      if (operation.financialYears && operation.financialYears?.length > 0) {
        this.financialYears = [...this.financialYears, ...operation.financialYears];
        this.totalRecords += operation.financialYears.length;
      }
      this.messageService.success(operation.message);
    }
  }
  //#endregion

  //#region Pagination , Searching , Shorting
  onGlobalFilter(searchText: HTMLInputElement) {
    this.pagination.searchTerm = searchText.value;
    this.pagination.pageNumber = 0;
    this.getFinancialYears(this.pagination);
  }
  onPageChange(event: any) {
    this.pagination.pageNumber = event.first / event.rows;
    this.pagination.pageSize = event.rows;
    this.getFinancialYears(this.pagination);
  }
  clearSearch() {
    this.pagination.searchTerm = '';
    this.getFinancialYears(this.pagination);
  }
  //#endregion

  //#region Client Side Operations
  public addFinancialYear() {
    this.financialYearSvcs.setOperationType("add");
    this.financialYearSvcs.showAddUpdatedDialog();
    this.financialYearSvcs.setFinancialYear(null);
    this.loadComponent(AddUpdateFinancialYearComponent);
  }
  public bulkAddFinancialYear() {
    this.financialYearSvcs.setBulkOperationType("add");
    this.financialYearSvcs.showBulkAddUpdatedDialog();
    this.financialYearSvcs.setBulkFinancialYear(null);
    this.loadComponent(BulkAddUpdateFinancialYearComponent);
  }
  public editFinancialYear(financialYear: FinancialYearDto) {
    this.financialYearSvcs.setOperationType("edit");
    this.financialYearSvcs.setFinancialYear({ financialYear, isSuccess: false });
    this.financialYearSvcs.showAddUpdatedDialog();
    this.loadComponent(AddUpdateFinancialYearComponent);
  }
  public bulkEditFinancialYear() {
    this.financialYearSvcs.setBulkOperationType("edit");
    this.financialYearSvcs.setBulkFinancialYear({ financialYears: this.selectedfinancialYears, isSuccess: false });
    this.financialYearSvcs.showBulkAddUpdatedDialog();
    this.loadComponent(BulkAddUpdateFinancialYearComponent);
  }
  public recoverFinancialYear() {
    this.financialYearSvcs.showRecoverDialog();
    this.loadComponent(ListRecoverFinancialYearComponent);
  }
  private loadComponent(component: any) {
    this.viewContainerRef.clear();
    this.componentRef = this.viewContainerRef.createComponent(component);
  }
  //#endregion

  //#region Server Side Operation
  private getFinancialYears(pagination: PaginationParams): void {
    this.loading = true;
    this.financialYearSvcs.get(pagination).pipe(takeUntil(this.destroy$)).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.responseCode === 200) {
          this.financialYears = response.data as FinancialYearDto[];
          this.totalRecords = response.count;
        }
      },
      error: (err) => {
        this.loading = false;
      }
    })
  }
  public removeFinancialYear(id: string, event: Event) {
    this.confirmationService.confirm({
      key: 'remove',
      target: event.target || new EventTarget,
      message: 'Are you sure that you want to Delete?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.financialYearSvcs.remove(id).pipe(takeUntil(this.destroy$)).subscribe({
          next: (response) => {
            if (response.responseCode === 200) {
              this.financialYears = this.financialYears.filter(fy => fy.financialYearId !== id);
              this.totalRecords -= 1;
              if (this.financialYears.length === 0) {
                this.pagination = new PaginationParams();
                this.getFinancialYears(this.pagination);
              }
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
  public bulkRemoveFinancialYears(): void {
    this.confirmationService.confirm({
      key: 'bulkRemove',
      accept: () => {
        this.financialYearSvcs.bulkRemove(this.selectedfinancialYears).pipe(takeUntil(this.destroy$)).subscribe({
          next: (response) => {
            if (response.responseCode === 200) {
              const removedFinancialYears = response.data as FinancialYearDto[];
              const financialYearIds = removedFinancialYears.map(s => s.financialYearId);
              this.financialYears = this.financialYears.filter(s => !financialYearIds.includes(s.financialYearId));
              this.selectedfinancialYears = [];
              this.totalRecords -= removedFinancialYears.length;
              if (this.financialYears.length === 0) {
                this.pagination = new PaginationParams();
                this.getFinancialYears(this.pagination);
              }
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

  //#region Test form
  get financialYearDtoJson(): string {
    return JSON.stringify(this.financialYears, null, 2);
  }
  //#endregion
}
