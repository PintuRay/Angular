import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Branch } from 'src/app/api/entity/branch';
import { PaginationParams } from 'src/app/api/model/paginationParams';
import { AuthenticationService } from 'src/app/api/service/account/authentication/authentication.service';
import { BranchService } from 'src/app/api/service/devloper/branch.service';

@Component({
  selector: 'app-list-branch',
  templateUrl: './list-branch.component.html',
})
export class ListBranchComponent {
  //#region Property Declaration
  canDelete: boolean = false;
  canCreate: boolean = false;
  canUpdate: boolean = false;
  subscription!: Subscription;
  branches: Branch[] = [];
  selectedBranches: Branch[] = [];
  cols: any[] = [];
  pagination = new PaginationParams();
  //#endregion 

  //#region constructor
  constructor(
    private branchSvcs: BranchService,
    private authSvcs: AuthenticationService,
    private router: Router
  ) { }
  //#endregion 

  //#region Lifecycle Hooks
  ngOnInit(): void {
    this.canDelete = this.authSvcs.getUserDetails().permissions.delete;
    this.canCreate = this.authSvcs.getUserDetails().permissions.create;
    this.canUpdate = this.authSvcs.getUserDetails().permissions.update;
    this.getAllBranch(this.pagination);
    // this.subscription = this.branchSvcs.getBranch().subscribe((branch) => {
    //   const index = this.branches.findIndex((u) => u.branchId === branch.branchId);
    //   if (index !== -1) {
    //     // this.branches[index] = branch;
    //     // this.cdr.detectChanges();
    //   }
    // });
  }
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  //#endregion

  //#region Client Side Vaildation

  //#endregion

  //#region Client Side Operations
  addBranch() {
    this.branchSvcs.setOperationType("add");
    this.branchSvcs.showAddUpdateBranchdDialog();
  }
  editBranch(branch: Branch) {
    this.branchSvcs.setOperationType("edit");
    this.branchSvcs.setBranch(branch);
    this.branchSvcs.showAddUpdateBranchdDialog();
  }
  bulkAddBranch() {
    this.branchSvcs.setOperationType("add");
    this.router.navigate(['branch/bulk-add-update']);
  }

  bulkEditBranch() {

  }
  removeBranch(id: string) { }
  bulkRemoveBranch() { }
  recoverBranch() {
    this.router.navigate(['branch/list-recover-branch']);
  }
  onGlobalFilter() { }
  //#endregion
  //#region Server Side Operation
  async getAllBranch(pagination: PaginationParams): Promise<void> {
    try {
      this.branchSvcs.getAllBranch(pagination).subscribe({
        next: (response) => {
          if (response.responseCode == 200) {
            this.branches = response.data.collectionObjData as Branch[];
          }
        },
        error: (response) => {

        },
        complete: () => {

        }
      })
    }
    catch (error) {

    }
  }
  //#endregion
}
