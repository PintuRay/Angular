import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { BranchDto } from 'src/app/api/entity/branch';
import { PaginationParams } from 'src/app/api/model/paginationParams';
import { AuthenticationService } from 'src/app/api/service/account/authentication/authentication.service';
import { BranchService } from 'src/app/api/service/devloper/branch.service';

@Component({
  selector: 'app-list-recover-branch',
  templateUrl: './list-recover-branch.component.html',
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
export class ListRecoverBranchComponent {
  //#region Property Declaration
  public display: boolean = false;
  public loading: boolean = false;
  canDelete: boolean = false;
  canUpdate: boolean = false;
  subscription!: Subscription;
  branches: BranchDto[];
  selectedBranches: BranchDto[];
  public totalRecords: number = 0;
  pagination: PaginationParams;
  cols: any[];
  //#endregion 

  //#region constructor
  constructor(
    private branchSvcs: BranchService,
    private authSvcs: AuthenticationService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.branches = [];
    this.selectedBranches = [];
    this.cols = [];
    this.pagination = new PaginationParams();
  }
  //#endregion 

  //#region Lifecycle Hooks
  ngOnInit(): void {
    this.canDelete = this.authSvcs.getUserDetails().permissions.delete;
    this.canUpdate = this.authSvcs.getUserDetails().permissions.update;
    this.getRemovedBranches(this.pagination);
  }
  //#endregion 

  //#region Pagination , Searching , Shorting
  onGlobalFilter(searchText: HTMLInputElement) { 
    this.pagination.searchTerm = searchText.value;
    this.pagination.pageNumber = 0;
    this.getRemovedBranches(this.pagination);
  }
  public onPageChange(event: any) {
    this.pagination.pageNumber = event.first / event.rows;
    this.pagination.pageSize = event.rows;
    this.getRemovedBranches(this.pagination);
  }
  public clearSearch() {
    this.pagination.searchTerm = '';
    this.getRemovedBranches(this.pagination);
  }
    //#endregion

  //#region Client Side Operations
  BackToList() {
    this.router.navigate(['branch/list-branch']);
  }
  //#endregion

  //#region Server Side Operation
   getRemovedBranches(pagination: PaginationParams): void {
    this.loading = true;
    try {
      this.branchSvcs.getRemovedBranches(pagination).subscribe({
        next: async(response) => {
          this.loading = false;
          if (response.responseCode === 200) {
            this.branches = response.data.collectionObjData as BranchDto[];
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
    }
  }
  recoverBranch(id: string) { 
    this.branchSvcs.recoverBranch(id).subscribe({
      next: (response) => {
        if (response.responseCode == 200) {
          this.branches = this.branches.filter(branch => branch.branchId !== id);
          this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: response.message });
        }
      },
      error: (response) => {},
      complete: () => {}
    })
  }
  bulkRecoverBranch() {
    const branchIds = this.selectedBranches.map(branch => branch.branchId);
    this.branchSvcs.bulkRecoverBranch(branchIds).subscribe({
      next: (response) => {
        if (response.responseCode == 200) {
          this.branches = this.branches.filter(branch => !branchIds.includes(branch.branchId));
          this.selectedBranches = [];
          this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: response.message });
        }
      },
      error: (response) => {

      },
      complete: () => {

      }
    })
   }
  deleteBranch(id: string) { 
    this.branchSvcs.deleteBranch(id).subscribe({
      next: (response) => {
        if (response.responseCode == 200) {
          this.branches = this.branches.filter(branch => branch.branchId !== id);
          this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: response.message });
        }
      },
      error: (response) => {},
      complete: () => {}
    })
  }
  bulkDeleteBranch() { 
    const branchIds = this.selectedBranches.map(branch => branch.branchId);
    this.branchSvcs.bulkDeleteBranch(branchIds).subscribe({
      next: (response) => {
        if (response.responseCode == 200) {
          this.branches = this.branches.filter(branch => !branchIds.includes(branch.branchId));
          this.selectedBranches = [];
          this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: response.message });
        }
      },
      error: (response) => {

      },
      complete: () => {

      }
    })
  }
  //#endregion
    //#region Test form
    get branchDtoJson(): string {
      return JSON.stringify(this.branches, null, 2);
    }
    //#endregion
}
