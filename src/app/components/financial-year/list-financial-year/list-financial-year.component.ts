import { Component } from '@angular/core';

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
  public display: boolean = false;
  public loading: boolean = false;
  public canDelete: boolean = false;
  public canCreate: boolean = false;
  public canUpdate: boolean = false;
  public isDevloper: boolean = false;
  private financialYearSubscription!: Subscription;
  private recoverSubscription!: Subscription;
  public financialYears: FinancialYearDto[];
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
        if (operation?.isSuccess) {
          if (operation?.financialYear) {
            const index = this.financialYears.findIndex(b => b.financialYearId === operation.financialYear?.financialYearId);
            if (index !== -1) {
              this.financialYears[index] = operation.financialYear;
              this.financialYears = [...this.financialYears];
            } else {
              this.financialYears = [...this.financialYears, operation.financialYear];
              this.totalRecords += 1;
            }
          }
        }
      });
    //Single Recover Subscription
    this.recoverSubscription = this.financialYearSvcs.getRecoverFinanancialYear()
      .subscribe(operation => {
        if (operation?.isSuccess) {
          if (operation.financialYear) {
            this.financialYears = [...this.financialYears, operation.financialYear];
            this.totalRecords += 1;
            this.messageService.add({ severity: 'success', summary: 'Success', detail: operation.message });
          }
          else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: operation.message });
          }
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
  public editFinancialYear(financialYear: FinancialYearDto) {
    this.financialYearSvcs.setOperationType("edit");
    this.financialYearSvcs.setfinancialYear({ financialYear, isSuccess: false });
  }
  public recoverBranch() {
    this.financialYearSvcs.showRecoverDialog();
  }
  
  public scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  //#endregion

  //#region Server Side Operation
  private getFinancialYears(pagination: PaginationParams): void {
    this.loading = true;
    try {
      this.financialYearSvcs.getFinancialYears(pagination).subscribe({
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
        }
      })
    }
    catch (err) {
      this.loading = false;
      this.messageService.add({ severity: 'error', summary: 'error', detail: 'Some Error Occoured' });
    }
  }
  public removeFinancialYear(id: string, event: Event) {
    this.confirmationService.confirm({
      key: 'removeFinancialYear',
      target: event.target || new EventTarget,
      message: 'Are you sure that you want to Delete?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.financialYearSvcs.removeFinancialYear(id).subscribe({
          next: async (response) => {
            if (response.responseCode === 200) {
              this.financialYears = this.financialYears.filter(fy => fy.financialYearId !== id);
              this.totalRecords -= 1;
              if (this.financialYears.length === 0) {
                this.pagination = new PaginationParams();
                this.getFinancialYears(this.pagination);
              }
              this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
            }
          },
          error: (err) => {
            if (err.error.responseCode === 404) {
              this.messageService.add({ severity: 'info', summary: 'Info', detail: err.error.message });
            }
            else if (err.error.responseCode === 400) {
              this.messageService.add({ severity: 'error', summary: 'error', detail: `Server Side Eroor: ${err.error.message}` });
            }
            else {
              this.messageService.add({ severity: 'error', summary: 'error', detail: 'An unknown error occurred.' });
            }
          }
        })
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
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
