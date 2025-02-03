import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { BranchDto, BranchModel, BranchUpdateModel } from 'src/app/api/entity/branch';
import { BranchService } from 'src/app/api/service/devloper/branch.service';
import { LayoutService } from '../../shared/service/app.layout.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-update-branch',
  templateUrl: './add-update-branch.component.html',
})
export class AddUpdateBranchComponent {

  //#region Property Declaration
  public display: boolean = false;
  public visible: boolean = false;
  public operationType: string = '';
  private dialogSub!: Subscription;
  private branchDataSub!: Subscription;
  private operationTypeSub!: Subscription;
  private branch: BranchDto;
  private addbranch: BranchModel;
  private updatebranch: BranchUpdateModel;
  public branchForm: FormGroup;
  public isLoading: boolean = false;
  //#endregion

  //#region constructor
  constructor(private fb: FormBuilder, private branchSvcs: BranchService, public layoutSvcs: LayoutService) {
    this.branchForm = this.initializeBranchForm();
    this.branch = new BranchDto();
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
      branchCode: ['', [Validators.required, Validators.pattern(/^[A-Z][A-Za-z0-9]*$/)]],
      branchName: ['', [Validators.required, Validators.pattern(/^[A-Z\s]+$/)]],
      branchAddress: ['', [Validators.required]],
      contactNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
    })
  }
  //#endregion

  //#region Client Side Vaildation
  private getFieldLabel(controlName: string): string {
    const labels: { [key: string]: string } = {
      branchName: 'Branch Name',
      branchCode: 'Branch Code',
      branchAddress: 'Branch Address',
      contactNumber: 'Contact Number'
    };
    return labels[controlName] || controlName;
  }
  private getBranchFormControl(controlName: string) {
    return this.branchForm.get(controlName);
  }
  public isFieldInvalid(controlName: string): boolean {
    const control = this.getBranchFormControl(controlName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }
  public getErrorMessage(controlName: string): string {
    const control = this.getBranchFormControl(controlName);
    if (!control) return '';
    if (control.hasError('required')) {
      return `${this.getFieldLabel(controlName)} is required.`;
    }
    if (controlName === 'contactNumber' && control.hasError('pattern')) {
      return `Please enter a valid 10-digit ${this.getFieldLabel(controlName)}`;
    }
    if (controlName === 'branchName' && control.hasError('pattern')) {
      return `${this.getFieldLabel(controlName)} should be in uppercase `;
    }
    if (controlName === 'branchCode' && control.hasError('pattern')) {
      return `${this.getFieldLabel(controlName)} should start with a letter and followed by a combination of letters and numbers.`;
    }
    return '';
  }
  //#endregion

  //#region Client Side Operations
  public hideDialog() {
    this.branchSvcs.hideAddUpdateBranchDialog();
    this.resetComponent();
  }
  private resetComponent() {
    this.branchForm.reset();
    this.branch = new BranchDto();
    this.addbranch = new BranchModel();
    this.updatebranch = new BranchUpdateModel();
  }
  //#endregion

  //#region Server Side Operation
  submit(): void {
    try {
      if (this.branchForm.valid) {
        this.isLoading = true;
        if (this.operationType === 'add') {
          this.branchSvcs.createBranch(this.addbranch).subscribe({
            next: async (response) => {
              if (response.responseCode === 201) {
                this.branch = {
                  ...this.addbranch,
                  branchId: response.data.id
                };
                this.branchSvcs.setBranch({ branch: this.branch, isSuccess: true, message: response.message });
                this.hideDialog();
              }
              this.isLoading = false;
            },
            error: (err) => {
              this.isLoading = false;
              if (err.error.responseCode === 400) {
                if (err.error?.data) {
                  const errorMessages = err.error.data.map((error: any) => {
                    return `${error.formattedMessagePlaceholderValues.PropertyName}: ${error.errorMessage}`;
                  }).join(', ');
                  this.branchSvcs.setBranch({ branch: null, isSuccess: true, message: errorMessages });
                }
                else {
                  this.branchSvcs.setBranch({ branch: null, isSuccess: true, message: err.error.message });
                }
              }
              else {
                this.branchSvcs.setBranch({ branch: this.branch, isSuccess: true, message: 'Some Error Occoured' });
              }
            }
          })
        } else {
          this.branchSvcs.updateBranch(this.updatebranch).subscribe({
            next: async (response) => {
              if (response.responseCode == 200) {
                this.branch = {
                  ...this.updatebranch,
                  branchId: response.data.id
                };
                this.branchSvcs.setBranch({ branch: this.branch, isSuccess: true, message: response.message });
                this.hideDialog();
              }
              this.isLoading = false;
            },
            error: (err) => {
              this.isLoading = false;
              if (err.error.responseCode === 400) {
                if (err.error?.data) {
                  const errorMessages = err.error.data.map((error: any) => {
                    return `${error.formattedMessagePlaceholderValues.PropertyName}: ${error.errorMessage}`;
                  }).join(', ');
                  this.branchSvcs.setBranch({ branch: null, isSuccess: true, message: errorMessages });
                }
                else {
                  this.branchSvcs.setBranch({ branch: null, isSuccess: true, message: err.error.message });
                }
              }
              else {
                this.branchSvcs.setBranch({ branch: this.branch, isSuccess: true, message: 'Some Error Occoured' });
              }
              this.hideDialog();
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
