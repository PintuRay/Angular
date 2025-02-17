import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { BranchFinancialYearDto } from 'src/app/api/entity/branchFinancialYear';
import { PaginationParams } from 'src/app/api/model/paginationParams';
import { AuthenticationService } from 'src/app/api/service/account/authentication/authentication.service';
import { BranchFinancialYearService } from 'src/app/api/service/devloper/branch-financial-year/branch-financial-year.service';

@Component({
  selector: 'app-list-branch-financial-year',
  templateUrl: './list-branch-financial-year.component.html',
})
export class ListBranchFinancialYearComponent {
  //#region Property Declaration
  public display: boolean;
  public loading: boolean;
  public canDelete: boolean;
  public canCreate: boolean;
  public canUpdate: boolean;
  public isDevloper: boolean;
  private branchFinancialYearSubscription: Subscription;
  private bulkBranchFinancialYearSubscription: Subscription
  private recoverSubscription: Subscription;
  private bulkRecoverSubscription: Subscription;
  public branchFinancialYears: BranchFinancialYearDto[];
  public selectedBranchFinancialYears: BranchFinancialYearDto[];
  public cols: any[];
  public pagination: PaginationParams;
  public totalRecords: number;
  //#endregion 

  //#region constructor
  constructor(
    private branchFinancialYearSvcs: BranchFinancialYearService,
    private authSvcs: AuthenticationService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.display = false;
    this.loading = false;
    this.canDelete = this.authSvcs.getUserDetails().permissions.delete;
    this.canCreate = this.authSvcs.getUserDetails().permissions.create;
    this.canUpdate = this.authSvcs.getUserDetails().permissions.update;
    this.isDevloper = this.authSvcs.getUserDetails().role.toLowerCase() === "devloper";
    this.branchFinancialYearSubscription = new Subscription;
    this.bulkBranchFinancialYearSubscription = new Subscription;
    this.recoverSubscription = new Subscription;
    this.bulkRecoverSubscription = new Subscription;
    this.branchFinancialYears = [];
    this.selectedBranchFinancialYears = [];
    this.cols = [];
    this.pagination = new PaginationParams();
    this.totalRecords = 0;
  }
  //#endregion 

  //#region Lifecycle Hooks
  ngOnInit(): void {
    //Permissions
    this.canDelete = this.authSvcs.getUserDetails().permissions.delete;
    this.canCreate = this.authSvcs.getUserDetails().permissions.create;
    this.canUpdate = this.authSvcs.getUserDetails().permissions.update;
    this.isDevloper = this.authSvcs.getUserDetails().role.toLowerCase() === "devloper";
    //Get financial Year records
    this.getBranchFinancialYears(this.pagination);
    //Single Insert or Update Subscription
    this.branchFinancialYearSubscription = this.branchFinancialYearSvcs.getBranchFinancialYear().subscribe(operation => {
        if (operation?.isSuccess) {
          if (operation?.branchFinancialYear) {
            const index = this.branchFinancialYears.findIndex(b => b.branchFinancialYearId === operation.branchFinancialYear?.branchFinancialYearId);
            if (index !== -1) {
              this.branchFinancialYears[index] = operation.branchFinancialYear;
              this.branchFinancialYears = [...this.branchFinancialYears];
            } else {
              this.branchFinancialYears = [...this.branchFinancialYears, operation.branchFinancialYear];
              this.totalRecords += 1;
            }
          }
        }
      });
    //Bulk Insert or Update Subscription
    this.bulkBranchFinancialYearSubscription = this.branchFinancialYearSvcs.getBulkBranchFinancialYear().subscribe(operation => {
        if (operation?.isSuccess) {
          if (operation?.branchFinancialYears && operation?.branchFinancialYears.length > 0) {
            const updatedBranchFinancialYears = [...this.branchFinancialYears];
            operation?.branchFinancialYears.forEach(newBranchFinancialYear => {
              const existingIndex = updatedBranchFinancialYears.findIndex(b => b.branchFinancialYearId === newBranchFinancialYear.branchFinancialYearId);
              if (existingIndex !== -1) {
                updatedBranchFinancialYears[existingIndex] = newBranchFinancialYear;
              } else {
                updatedBranchFinancialYears.push(newBranchFinancialYear);
              }
            });
            this.branchFinancialYears = [...updatedBranchFinancialYears];
          }
        }
      });
    //Single Recover Subscription
    this.recoverSubscription = this.branchFinancialYearSvcs.getRecoverBranchFinancialYear().subscribe(operation => {
        if (operation?.isSuccess) {
          if (operation.branchFinancialYear) {
            this.branchFinancialYears = [...this.branchFinancialYears, operation.branchFinancialYear];
            this.totalRecords += 1;
            this.messageService.add({ severity: 'success', summary: 'Success', detail: operation.message });
          }
          else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: operation.message });
          }
        }
      });
    //Bulk Recover Subscription
    this.bulkRecoverSubscription = this.branchFinancialYearSvcs.getBulkBranchFinancialYear().subscribe(operation =>{
      if (operation?.isSuccess) {
        if (operation.branchFinancialYears) {
          operation?.branchFinancialYears.forEach(branchFinancialYear => {
            this.branchFinancialYears.push(branchFinancialYear);
          });
          this.totalRecords += operation?.branchFinancialYears.length;
        }
      }
    });
  }
  ngOnDestroy(): void {
    this.branchFinancialYearSubscription?.unsubscribe();
    this.recoverSubscription?.unsubscribe();
  }
  //#endregion 

  //#region Pagination , Searching , Shorting
  onGlobalFilter(searchText: HTMLInputElement) {
    this.pagination.searchTerm = searchText.value;
    this.pagination.pageNumber = 0;
    this.getBranchFinancialYears(this.pagination);
  }
  onPageChange(event: any) {
    this.pagination.pageNumber = event.first / event.rows;
    this.pagination.pageSize = event.rows;
    this.getBranchFinancialYears(this.pagination);
  }
  clearSearch() {
    this.pagination.searchTerm = '';
    this.getBranchFinancialYears(this.pagination);
  }
  //#endregion

  //#region Client Side Operations
  public addBranchFinancialYear() {
    this.branchFinancialYearSvcs.setOperationType("add");
    this.branchFinancialYearSvcs.showAddUpdatedDialog();
  }
  public editBranchFinancialYear(branchFinancialYear: BranchFinancialYearDto) {
    this.branchFinancialYearSvcs.setOperationType("edit");
    this.branchFinancialYearSvcs.setBranchFinancialYear({ branchFinancialYear, isSuccess: false });
    this.branchFinancialYearSvcs.showAddUpdatedDialog();
  }
  public bulkAddBranchFinancialYear() {
    this.branchFinancialYearSvcs.setBulkOperationType("add");
    this.branchFinancialYearSvcs.showBulkAddUpdatedDialog();
  }
  public bulkEditBranchFinancialYear() {
    this.branchFinancialYearSvcs.setBulkOperationType("edit");
    this.branchFinancialYearSvcs.setBulkBranchFinancialYear({ branchFinancialYears: this.selectedBranchFinancialYears, isSuccess: false });
  }
  public recoverBranchFinancialYear() {
    this.branchFinancialYearSvcs.showRecoverDialog();
  }
  private handleError(err: any) {
    switch (err.error.responseCode) {
      case 302:
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.message });
        break;
      case 404:
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.message });
        break;
      case 400:
        if (err.error?.data) {
          const messages = err.error.data.map((error: any) => {
            return {
              severity: 'error',
              summary: 'Error',
              detail: `${error.formattedMessagePlaceholderValues.PropertyName}: ${error.errorMessage}`
            };
          });
          this.messageService.addAll(messages);
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.message });
        }
        break;
      case 500:
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Internal server error' });
        break;
      default:
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An unexpected error occurred' });
        break;
    }
  }
  //#endregion

  //#region Server Side Operation
  private getBranchFinancialYears(pagination: PaginationParams): void {
    this.loading = true;
    try {
      this.branchFinancialYearSvcs.get(pagination).subscribe({
        next: async (response) => {
          this.loading = false;
          if (response.responseCode === 200) {
            this.branchFinancialYears = response.data.collectionObjData as BranchFinancialYearDto[];
            this.totalRecords = response.data.count;
          }
        },
        error: (err) => {
          this.loading = false;
         this.handleError(err);
        }
      })
    }
    catch (err) {
      this.loading = false;
      this.messageService.add({ severity: 'error', summary: 'error', detail: 'Some Error Occoured' });
    }
  }
  public removeBranchFinancialYear(id: string, event: Event) {
    this.confirmationService.confirm({
      key: 'remove',
      target: event.target || new EventTarget,
      message: 'Are you sure that you want to Delete?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.branchFinancialYearSvcs.remove(id).subscribe({
          next: async (response) => {
            if (response.responseCode === 200) {
              this.branchFinancialYears = this.branchFinancialYears.filter(fy => fy.branchFinancialYearId !== id);
              this.totalRecords -= 1;
              if (this.branchFinancialYears.length === 0) {
                this.pagination = new PaginationParams();
                this.getBranchFinancialYears(this.pagination);
              }
              this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
            }
          },
          error: (err) => {
            this.handleError(err);
          }
        })
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
      }
    });
  }
    public bulkRemoveBranchFinancialYear(): void {
      this.confirmationService.confirm({
        key: 'bulkRemove',
        accept: () => {
          this.branchFinancialYearSvcs.bulkRemove(this.selectedBranchFinancialYears).subscribe({
            next: async (response) => {
              if (response.responseCode === 200) {
                const removedBranchFinancialYears = response.data.records as BranchFinancialYearDto[];
                const branchFinancialYearIds = removedBranchFinancialYears.map(s => s.branchFinancialYearId);
                this.branchFinancialYears = this.branchFinancialYears.filter(s => !branchFinancialYearIds.includes(s.branchFinancialYearId));
                this.selectedBranchFinancialYears = [];
                this.totalRecords -= response.data.count;
                if (this.branchFinancialYears.length === 0) {
                  this.pagination = new PaginationParams();
                  this.getBranchFinancialYears(this.pagination);
                }
                this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
              }
            },
            error: (err) => {
              this.handleError(err);
            }
          })
        }
      });
    }
  //#endregion

  //#region Test form
  get financialYearDtoJson(): string {
    return JSON.stringify(this.branchFinancialYears, null, 2);
  }
  //#endregion
}
