import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { FinancialYearDto } from 'src/app/api/entity/financialYear';
import { PaginationParams } from 'src/app/api/model/paginationParams';
import { AuthenticationService } from 'src/app/api/service/account/authentication/authentication.service';
import { FinancialYearService } from 'src/app/api/service/devloper/financial-year.service';

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
  public canDelete: boolean = false;
  public canCreate: boolean = false;
  public canUpdate: boolean = false;
  public isDevloper: boolean = false;
  private financialYearSubscription!: Subscription;
  private recoverSubscription!: Subscription;
  public financialYears: FinancialYearDto[];
  public selectedfinancialYears: FinancialYearDto[];
  public cols: any[];
  public pagination: PaginationParams;
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
    this.selectedfinancialYears = [];
    this.cols = [];
    this.pagination = new PaginationParams();
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
    this.getFinancialYears(this.pagination);
    //Single Insert or Update Subscription
    this.financialYearSubscription = this.financialYearSvcs.getFinanancialYear()
      .subscribe(operation => {
        if (operation?.financialYear) {
          const index = this.financialYears.findIndex(b => b.financialYearId === operation.financialYear.financialYearId);
          if (operation.isSuccess) {
            if (index !== -1) {
              this.financialYears[index] = operation.financialYear;
              this.financialYears = [...this.financialYears];
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Financial Year updated successfully' });
            } else {
              this.financialYears = [...this.financialYears, operation.financialYear];
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Financial Year added successfully' });
            }
          }
        }
      });
    //Single Recover Subscription
    this.recoverSubscription = this.financialYearSvcs.getRecoverFinanancialYear()
      .subscribe(operation => {
        if (operation?.isSuccess) {
          this.financialYears = [...this.financialYears, operation.financialYear];
        }
      });
  }
  ngOnDestroy(): void {
    this.financialYearSubscription?.unsubscribe();
    this.recoverSubscription?.unsubscribe();
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
  editFinancialYear(financialYear: FinancialYearDto) {
    this.financialYearSvcs.setOperationType("edit");
    this.financialYearSvcs.setfinancialYear(financialYear);
  }
  recoverBranch() {
    this.financialYearSvcs.showRecoverDialog();
  }
  //#endregion

  //#region Server Side Operation
  async getFinancialYears(pagination: PaginationParams): Promise<void> {
    try {
      this.financialYearSvcs.getFinancialYears(pagination).subscribe({
        next: (response) => {
          if (response.responseCode === 200) {
            this.financialYears = response.data.collectionObjData as FinancialYearDto[];
            this.totalRecords = response.data.count;
          }
        },
        error: (response) => {
          this.messageService.add({ severity: 'error', summary: 'error', detail: 'Internal Server Error' });
        },
        complete: () => { }
      })
    }
    catch (error) {
      this.messageService.add({ severity: 'error', summary: 'error', detail: 'Some Error Occoured' });
    }
  }
  removeFinancialYear(id: string, event: Event) {
    this.confirmationService.confirm({
      key: 'removeFinancialYear',
      target: event.target || new EventTarget,
      message: 'Are you sure that you want to Delete?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.financialYearSvcs.removeFinancialYear(id).subscribe({
          next: (response) => {
            if (response.responseCode === 200) {
              this.financialYears = this.financialYears.filter(fy => fy.financialYearId !== id);
              this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: response.message });
            }
          },
          error: (response) => {
            this.messageService.add({ severity: 'error', summary: 'error', detail: 'Some Error Occoured' });
          },
          complete: () => { }
        })
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
      }
    });
  }
  //#endregion
}
