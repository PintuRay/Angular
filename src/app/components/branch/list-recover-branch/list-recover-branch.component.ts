import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Branch } from 'src/app/api/entity/branch';
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
  branches: Branch[] = [];
  selectedBranches: Branch[] = [];
  cols: any[] = [];
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
  }
  //#endregion 

  onGlobalFilter() { }
  bulkRecoverBranch() { }
  bulkDeleteBranch() { }
  BackToList(){
    this.router.navigate(['branch/list-branch']);
  }
}
