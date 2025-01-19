import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
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
  operationType: string = '';
  private dialogSub!: Subscription;
  private branchDataSub!: Subscription;
  private operationTypeSub!: Subscription;
  branch: Branch;
  addbranch: BranchModel;
  updatebranch: BranchUpdateModel;
  branchForm: FormGroup;
  isLoading: boolean = false;
  //#endregion

  //#region constructor
  constructor(private fb: FormBuilder, private branchSvcs: BranchService, public layoutSvcs: LayoutService) {
    this.branchForm = this.initializeBranchForm();
    this.branch = new Branch();
    this.addbranch = new BranchModel();
    this.updatebranch = new BranchUpdateModel()
  }
  //#endregion

  //#region Lifecycle Hooks
  ngOnInit() {
    this.dialogSub = this.branchSvcs.changeAddUpdateBranchDialogVisibility$.subscribe(
      isVisible => {
        this.visible = isVisible;
      }
    );
    this.branchDataSub = this.branchSvcs.getBranch().subscribe((branch) => {
      if (branch != null) {
        this.branch = branch;
        this.updatebranch.branchId = branch.branchId;
        this.branchForm.patchValue({
          branchCode: branch.branchCode,
          branchName: branch.branchName,
          branchAddress: branch.branchAddress,
          contactNumber: branch.contactNumber
        });
      }
    });
    this.operationTypeSub = this.branchSvcs.getOperationType().subscribe((data) => {
      this.operationType = data;
      if (this.operationType === 'add') {
        this.branchForm.valueChanges.subscribe((values) => {
          this.addbranch = { ...this.addbranch, ...values };
        });
      }
      else {
        this.branchForm.valueChanges.subscribe((values) => {
          this.updatebranch = { ...this.updatebranch, ...values };
        });
      }
    });
  }
  ngOnDestroy() {
    this.dialogSub?.unsubscribe();
    this.operationTypeSub?.unsubscribe();
    this.branchDataSub?.unsubscribe();
  }
  //#endregion

  //#region Themme
  get dark(): boolean {
    return this.layoutSvcs.config().colorScheme !== 'light';
  }
  //#endregion

  //#region Form Initialization
  private initializeBranchForm(): FormGroup {
    return this.fb.group({
      branchCode: ['', [Validators.required]],
      branchName: ['', [Validators.required]],
      branchAddress: ['', [Validators.required]],
      contactNumber: ['', [Validators.required]],
    })
  }
  //#endregion

  //#region Client Side Vaildation

  //#endregion

  //#region Client Side Operations
  hideDialog() {
    this.branchSvcs.hideAddUpdateBranchDialog();
    this.resetComponent();
  }
  private resetComponent() {
    this.branchForm.reset();
    this.branch = new Branch();
    this.addbranch = new BranchModel();
    this.updatebranch = new BranchUpdateModel();
  }
  //#endregion

  //#region Server Side Operation
  async submit(): Promise<void> {
    try {
      if (this.branchForm.valid) {
        if (this.operationType === 'add') {
          this.branchSvcs.createBranch(this.addbranch).subscribe({
            next: (response) => {
              if (response.responseCode === 201) {
                this.branch = {
                  ...this.addbranch,
                  branchId: response.data.id
                };
                this.branchSvcs.setBranch(this.branch);
                this.hideDialog();
              }
            },
            error: (response) => {

            },
            complete: () => {

            }
          })
        } else {
          this.branchSvcs.updateBranch(this.updatebranch).subscribe({
            next: (response) => {
              if (response.responseCode == 200) {
                this.branch = {
                  ...this.updatebranch,
                  branchId: response.data.id
                };
                this.branchSvcs.setBranch(this.branch);
                this.hideDialog();
              }
            },
            error: (response) => {

            },
            complete: () => {

            }
          })
        }
      }
    }
    catch (error) {
    }
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
