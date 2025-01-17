import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { BranchModel, BranchUpdateModel } from 'src/app/api/entity/branch';
import { BranchService } from 'src/app/api/service/devloper/branch.service';
import { LayoutService } from '../../shared/service/app.layout.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-update-branch',
  templateUrl: './add-update-branch.component.html',
})
export class AddUpdateBranchComponent {
  //#region Property Declaration
  visible: boolean = false;
  private dialogSub!: Subscription;
  private branchDataSub!: Subscription;
  private operationTypeSub!: Subscription;
  operationType: string = '';
  addbranch: BranchModel = new BranchModel();
  updatebranch: BranchUpdateModel = new BranchUpdateModel();
  branchForm!: FormGroup;
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
    this.dialogSub = this.branchSvcs.changeAddUpdateBranchDialogVisibility$.subscribe(
      isVisible => {
        this.visible = isVisible;
      }
    );
    this.operationTypeSub = this.branchSvcs.getOperationType().subscribe((data) => {
      this.operationType = data;
    });
    
    this.branchDataSub = this.branchSvcs.getBranch().subscribe((branch) => {
      if (this.operationType === 'edit') {

      }
    });
  }
  ngOnDestroy() {
    this.dialogSub.unsubscribe();
    this.operationTypeSub.unsubscribe();
    this.branchDataSub.unsubscribe();
  }
  //#endregion

  //#region Themme
  get dark(): boolean {
    return this.layoutSvcs.config().colorScheme !== 'light';
  }
  //#endregion

  //#region Form Initialization
  private initializeBranchForm(): void {
    this.branchForm = this.fb.group({
      branchName:['', [Validators.required]],
      branchAddress:['', [Validators.required]],
      contactNumber:['', [Validators.required]],
      branchCode:['', [Validators.required]],
    })
  }
  //#endregion

  //#region Client Side Vaildation

  //#endregion

  //#region Client Side Operations
  hideDialog() {
    this.branchSvcs.hideAddUpdateBranchDialog();
  }
  //#endregion

  //#region Test form

   //#endregion
}
