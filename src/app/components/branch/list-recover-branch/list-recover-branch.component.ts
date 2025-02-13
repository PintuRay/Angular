import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BranchDto } from 'src/app/api/entity/branch';
import { PaginationParams } from 'src/app/api/model/paginationParams';
import { AuthenticationService } from 'src/app/api/service/account/authentication/authentication.service';
import { BranchMessageService } from 'src/app/api/service/devloper/branch/branch-message.service';
import { BranchService } from 'src/app/api/service/devloper/branch/branch.service';

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
  public display = false;
  public loading = false;
  public canDelete = false;
  public canUpdate = false;
  public isDevloper = false;
  public subscription: Subscription = new Subscription();
  public branches: BranchDto[] = [];
  public selectedBranches: BranchDto[] = [];
  public totalRecords = 0;
  public pagination = new PaginationParams();
  public cols: any[] = []
  //#endregion 
 
  //#region constructor
  constructor(
    private readonly branchSvcs: BranchService,
    private readonly authSvcs: AuthenticationService,
    private readonly router: Router,
    private readonly messageService: BranchMessageService,
  ) { }
  //#endregion 

  //#region Lifecycle Hooks
  ngOnInit(): void {
    this.canDelete = this.authSvcs.getUserDetails().permissions.delete;
    this.canUpdate = this.authSvcs.getUserDetails().permissions.update;
    this.isDevloper = this.authSvcs.getUserDetails().role.toLowerCase() === "devloper";
    this.getRemovedBranches(this.pagination);
  }
  //#endregion 

  //#region Pagination , Searching , Shorting
  public onGlobalFilter(searchText: HTMLInputElement) {
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
  public BackToList() {
    this.router.navigate(['branch/list-branch']);
  }
  //#endregion

  //#region Server Side Operation
  private getRemovedBranches(pagination: PaginationParams): void {
    this.loading = true;
    this.branchSvcs.getRemoved(pagination).subscribe({
      next: async (response) => {
        this.loading = false;
        if (response.responseCode === 200) {
          this.branches = response.data.records as BranchDto[];
          this.totalRecords = response.data.count;
        }
      },
      error: (err) => {
        this.loading = false;
      },
    })
  }
  public recoverBranch(id: string) {
    this.branchSvcs.recover(id).subscribe({
      next: (response) => {
        if (response.responseCode == 200) {
          this.branches = this.branches.filter(branch => branch.branchId !== id);
          this.totalRecords -= 1;
          if (this.branches.length === 0) {
            this.pagination = new PaginationParams();
            this.getRemovedBranches(this.pagination);
          }
          this.messageService.success(response.message);
        }
      },
      error: (err) => { }
    })
  }
  public bulkRecoverBranch() {
    this.branchSvcs.bulkRecover(this.selectedBranches).subscribe({
      next: (response) => {
        if (response.responseCode == 200) {
          const recoveredbranches = response.data.records as BranchDto[];
          const branchIds = recoveredbranches.map(branch => branch.branchId);
          this.branches = this.branches.filter(branch => !branchIds.includes(branch.branchId));
          this.selectedBranches = [];
          this.totalRecords -= response.data.count;
          if (this.branches.length === 0) {
            this.pagination = new PaginationParams();
            this.getRemovedBranches(this.pagination);
          }
          this.messageService.success(response.message);
        }
      },
      error: (err) => { }
    })
  }
  public deleteBranch(id: string) {
    this.branchSvcs.delete(id).subscribe({
      next: (response) => {
        if (response.responseCode === 200) {
          this.branches = this.branches.filter(branch => branch.branchId !== id);
          this.totalRecords -= 1;
          if (this.branches.length === 0) {
            this.pagination = new PaginationParams();
            this.getRemovedBranches(this.pagination);
          }
          this.messageService.success(response.message);
        }
      },
      error: (err) => { }
    })
  }
  public bulkDeleteBranch() {
    const branchIds = this.selectedBranches.map(branch => branch.branchId);
    this.branchSvcs.bulkDelete(branchIds).subscribe({
      next: (response) => {
        if (response.responseCode === 200) {
          this.branches = this.branches.filter(branch => !branchIds.includes(branch.branchId));
          this.totalRecords -= branchIds.length;
          this.selectedBranches = [];
          if (this.branches.length === 0) {
            this.pagination = new PaginationParams();
            this.getRemovedBranches(this.pagination);
          }
          this.messageService.success(response.message);
        }
      },
      error: (err) => { }
    })
  }
  //#endregion

  //#region Test form
  get branchDtoJson(): string {
    return JSON.stringify(this.branches, null, 2);
  }
  //#endregion
}
