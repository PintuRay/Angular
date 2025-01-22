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
    this.branchDataSub = this.branchSvcs.getBranch().subscribe((operation) => {
      if (operation?.branch != null) {
        this.branch = operation.branch;
        this.updatebranch.branchId = operation.branch.branchId;
        this.branchForm.patchValue({
          branchCode: operation.branch.branchCode,
          branchName: operation.branch.branchName,
          branchAddress: operation.branch.branchAddress,
          contactNumber: operation.branch.contactNumber
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
      contactNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
    })
  }
  //#endregion

  //#region Client Side Vaildation
  get branchCodeControl() {
    return this.branchForm.get('branchCode');
  }
  getBranchCodeErrorMessage() {
    if (this.branchCodeControl?.hasError('required')) {
      return 'Branch Code is required.';
    }
    else {
      return '';
    }
  }
  get branchNameControl() {
    return this.branchForm.get('branchName');
  }
  getBranchNameErrorMessage() {
    if (this.branchNameControl?.hasError('required')) {
      return 'Branch Name is required.';
    }
    else {
      return '';
    }
  }
  get phoneControl() {
    return this.branchForm.get('contactNumber');
  }
  getPhoneErrorMessage() {
    if (this.phoneControl?.hasError('required')) {
      return 'Phone Number is required.';
    } else if (this.phoneControl?.hasError('pattern')) {
      return 'Phone Number Must Be 10  digit.';
    } else {
      return '';
    }
  }
  get addressControl() {
    return this.branchForm.get('branchAddress');
  }
  getAddressErrorMessage() {
    if (this.addressControl?.hasError('required')) {
      return 'Address is required.';
    }
    else {
      return '';
    }
  }
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
        this.isLoading = true;
        if (this.operationType === 'add') {
          this.branchSvcs.createBranch(this.addbranch).subscribe({
            next: (response) => {
              if (response.responseCode === 201) {
                this.branch = {
                  ...this.addbranch,
                  branchId: response.data.id
                };
                this.branchSvcs.setBranch(this.branch, true);
                this.hideDialog();
              }
              this.isLoading = false;
            },
            error: (response) => {
              this.isLoading = false;
            
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
                this.branchSvcs.setBranch(this.branch, true);
                this.hideDialog();
              }
              this.isLoading = false;
            },
            error: (response) => {
              this.isLoading = false;
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
