import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { BranchService } from 'src/app/api/service/devloper/branch.service';
import { LayoutService } from '../../shared/service/app.layout.service';

@Component({
  selector: 'app-bulk-add-update-branch',
  templateUrl: './bulk-add-update-branch.component.html',

})
export class BulkAddUpdateBranchComponent {
  //#region Property Declaration
  private operationTypeSub!: Subscription;
  operationType: string = '';
  //#endregion

  //#region constructor
  constructor(
    private fb: FormBuilder,
    private branchSvcs: BranchService,
    public layoutSvcs: LayoutService,
  ) { }
  //#endregion
  
  //#region Lifecycle Hooks
  ngOnInit() {
    this.operationTypeSub = this.branchSvcs.getOperationType().subscribe((data) => {
      this.operationType = data;
    });
  }
  ngOnDestroy() {
    this.operationTypeSub.unsubscribe();
  }
  //#endregion
}
