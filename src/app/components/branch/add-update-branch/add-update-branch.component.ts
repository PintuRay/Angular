import { Component } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { Branch, BranchModel, BranchUpdateModel } from 'src/app/api/entity/branch';
import { BranchService } from 'src/app/api/service/devloper/branch.service';
import { LayoutService } from '../../shared/service/app.layout.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-update-branch',
  templateUrl: './add-update-branch.component.html',
})
export class AddUpdateBranchComponent {
  //#region Property Declaration
  display: boolean = false;
  visible: boolean = false;
  private dialogSub!: Subscription;
  private branchDataSub!: Subscription;
  private operationTypeSub!: Subscription;
  operationType: string = '';
  branch: Branch = new Branch();
  addbranch: BranchModel = new BranchModel();
  updatebranch: BranchUpdateModel = new BranchUpdateModel();
  branchForm!: FormGroup;
  isLoading: boolean = false;
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
    this.branchDataSub = this.branchSvcs.getBranch().subscribe((branch) => {
      this.branch = branch;
    });
    this.operationTypeSub = this.branchSvcs.getOperationType().subscribe((data) => {
      this.operationType = data;
    });

    this.initializeBranchForm(this.branch);
    if (this.operationType == 'add') {
      this.branchForm.valueChanges.subscribe((values) => {
        console.log(values)
        this.addbranch = { ...this.addbranch, ...values };
      });
    }
    else {
      this.branchForm.valueChanges.subscribe((values) => {
        this.updatebranch = { ...this.updatebranch, ...values };
      });
    }
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
  private initializeBranchForm(branchData?: Branch): void {
    this.branchForm = this.fb.group({
      branchCode: [branchData ? branchData.branchCode : '', [Validators.required]],
      branchName: [branchData ? branchData.branchName : '', [Validators.required]],
      branchAddress: [branchData ? branchData.branchAddress : '', [Validators.required]],
      contactNumber: [branchData ? branchData.contactNumber : '', [Validators.required]],
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

  //# Server Side Operation
  submit() {

  }
  //#endregion
  //#region Test form
  get formJson(): string {
    return JSON.stringify(this.branchForm.value, null, 2);
  }
  get branchJson(): string {
    return JSON.stringify(this.branch, null, 2);
  }
  get branchModelJson(): string {
    return JSON.stringify(this.addbranch, null, 2);
  }
  get BranchUpdatemodelJson(): string {
    return JSON.stringify(this.updatebranch, null, 2);
  }
  get formErrors(): string {
    return JSON.stringify(this.branchForm.errors, null, 2);
  }
  //#endregion
}
