import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Branch } from 'src/app/api/entity/branch';
import { PaginationParams } from 'src/app/api/model/paginationParams';
import { AuthenticationService } from 'src/app/api/service/account/authentication/authentication.service';
import { BranchService } from 'src/app/api/service/devloper/branch.service';
import { ConfirmationService, MessageService } from 'primeng/api';
@Component({
  selector: 'app-list-branch',
  templateUrl: './list-branch.component.html',
  providers: [ConfirmationService, MessageService]
})
export class ListBranchComponent {
  //#region Property Declaration
  canDelete: boolean = false;
  canCreate: boolean = false;
  canUpdate: boolean = false;
  subscription!: Subscription;
  deleteSubscription!: Subscription;
  branches: Branch[] = [];
  selectedBranches: Branch[] = [];
  cols: any[] = [];
  pagination = new PaginationParams();
  //#endregion 

  //#region constructor
  constructor(
    private branchSvcs: BranchService,
    private authSvcs: AuthenticationService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }
  //#endregion 

  //#region Lifecycle Hooks
  ngOnInit(): void {
    this.canDelete = this.authSvcs.getUserDetails().permissions.delete;
    this.canCreate = this.authSvcs.getUserDetails().permissions.create;
    this.canUpdate = this.authSvcs.getUserDetails().permissions.update;
    this.getAllBranch(this.pagination);
    this.subscription = this.branchSvcs.getBranch()
      .subscribe(updatedBranch => {
        if (updatedBranch) {
          const index = this.branches.findIndex(b => b.branchId === updatedBranch.branchId);
          if (index !== -1) {
            this.branches[index] = updatedBranch;
            this.branches = [...this.branches];
          } else {
            this.branches = [...this.branches, updatedBranch];
          }
        }
      });
      this.deleteSubscription = this.branchSvcs.getDeletedBranch()
      .subscribe(deletedBranchId => {
        if (deletedBranchId) {
          this.branches = this.branches.filter(branch => branch.branchId !== deletedBranchId);
        }
      });
  }
  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.deleteSubscription?.unsubscribe();
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
  removeBranch(id: string, event: Event) {
    this.confirmationService.confirm({
      key: 'confirm2',
      target: event.target || new EventTarget,
      message: 'Are you sure that you want to Delete?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.branchSvcs.removeBranch(id).subscribe({
          next: (response) => {
            if (response.responseCode == 200) {
              this.branchSvcs.setDeletedBranch(response.data.id);
              this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: response.message });
            }
          },
          error: (response) => {

          },
          complete: () => {

          }
        })

      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
      }
    });
  }
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
            this.branchSvcs.setBranchList(this.branches);
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
