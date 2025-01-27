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
})
export class ListRecoverBranchComponent {
  //#region Property Declaration
  canDelete: boolean = false;
  canCreate: boolean = false;
  canUpdate: boolean = false;
  subscription!: Subscription;
  branches: BranchDto[];
  selectedBranches: BranchDto[];
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
    this.canCreate = this.authSvcs.getUserDetails().permissions.create;
    this.canUpdate = this.authSvcs.getUserDetails().permissions.update;
    this.getRemovedBranches(this.pagination);
  }
  //#endregion 

  //#region Client Side Vaildation
 
  //#endregion

  //#region Client Side Operations
  onGlobalFilter() { }
  BackToList() {
    this.router.navigate(['branch/list-branch']);
  }
  //#endregion

  //#region Server Side Operation
  async getRemovedBranches(pagination: PaginationParams): Promise<void> {
    try {
      this.branchSvcs.getRemovedBranches(pagination).subscribe({
        next: (response) => {
          console.log(response);
          if (response.responseCode === 200) {
            this.branches = response.data.collectionObjData as BranchDto[];
          }
        },
        error: (response) => {},
      })
    }
    catch (error) {

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
}
