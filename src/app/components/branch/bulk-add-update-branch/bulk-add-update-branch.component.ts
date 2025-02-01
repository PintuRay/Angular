import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { filter, Subscription } from 'rxjs';
import { BranchService } from 'src/app/api/service/devloper/branch.service';
import { LayoutService } from '../../shared/service/app.layout.service';
import { BranchDto, BranchModel, BranchUpdateModel } from 'src/app/api/entity/branch';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-bulk-add-update-branch',
  templateUrl: './bulk-add-update-branch.component.html',
})
export class BulkAddUpdateBranchComponent {
  
  //#region Property Declaration
  public display: boolean = false;
  public operationType: string = '';
  private operationTypeSub!: Subscription;
  private branchDataSub!: Subscription;
  public branch: BranchDto[];
  private addbranch: BranchModel[];
  private updatebranch: BranchUpdateModel[];
  public branchForm: FormGroup;
  public isLoading: boolean = false;
  //#endregion

  //#region constructor
  constructor(private fb: FormBuilder, private branchSvcs: BranchService, public layoutSvcs: LayoutService, private router: Router, private messageService: MessageService) {
    this.branchForm = this.initializeBranchForm();
    this.branch = [];
    this.addbranch = [];
    this.updatebranch = [];
  }
  //#endregion

  //#region Lifecycle Hooks
  ngOnInit() {
    this.operationTypeSub = this.branchSvcs.getBulkOperationType().pipe(filter(type => !!type))
      .subscribe((data) => {
        this.operationType = data;
        if (this.operationType === 'add') {
          this.addBranch();
          this.branchForm.valueChanges.subscribe((values) => {
            this.addbranch = values.branches.map((branch: any) => ({
              ...new BranchModel(),
              ...branch
            }));
          });
        }
        else if (this.operationType === 'edit') {
          this.branchForm.valueChanges.subscribe((values) => {
            this.updatebranch = values.branches.map((branch: any, index: number) => ({
              ...this.updatebranch[index],
              ...branch
            }));
          });
        }
      });
    this.branchDataSub = this.branchSvcs.getBulkBranch().subscribe((operation) => {
      if (operation?.branches != null && operation?.branches.length > 0) {
        this.branch = operation?.branches;
        while (this.branches.length) {
          this.branches.removeAt(0);
        }
        if (this.operationType === 'edit') {
          operation?.branches.forEach(branch => {
            const branchGroup = this.createBranchFormGroup();
            branchGroup.patchValue({
              branchId: branch.branchId,
              branchCode: branch.branchCode,
              branchName: branch.branchName,
              branchAddress: branch.branchAddress,
              contactNumber: branch.contactNumber
            });
            this.branches.push(branchGroup);
          });
        }
      }
    });
  }
  ngOnDestroy() {
    this.operationTypeSub?.unsubscribe();
    this.branchDataSub?.unsubscribe();
  }
  //#endregion

  //#region Form Initialization
  private initializeBranchForm(): FormGroup {
    return this.fb.group({
      branches: this.fb.array([])
    });
  }
  //#endregion
  
  //#region Client Side Validation
  public getBranchControl(index: number, controlName: string) {
    return this.branches.at(index).get(controlName);
  }
  public getErrorMessage(index: number, controlName: string): string {
    const control = this.getBranchControl(index, controlName);
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
      return  `${this.getFieldLabel(controlName)} should start with a uppercase letters and followed by a combination of letters and numbers.`;
    }
    return '';
  }
  private getFieldLabel(controlName: string): string {
    const labels: { [key: string]: string } = {
      branchName: 'Branch Name',
      branchCode: 'Branch Code',
      branchAddress: 'Branch Address',
      contactNumber: 'Contact Number'
    };
    return labels[controlName] || controlName;
  }
  isFieldInvalid(index: number, controlName: string): boolean {
    const control = this.getBranchControl(index, controlName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }
  //#endregion
  
  //#region Client Side Operations
  get branches() {
    return this.branchForm.get('branches') as FormArray;
  }
  createBranchFormGroup(): FormGroup {
    return this.fb.group({
      branchId: [''],
      branchCode: ['', [Validators.required, Validators.pattern(/^[A-Z][A-Za-z0-9]*$/)]],
      branchName: ['', [Validators.required, Validators.pattern(/^[A-Z\s]+$/)]],
      branchAddress: ['', [Validators.required]],
      contactNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
    });
  }
  addBranch() {
    this.branches.push(this.createBranchFormGroup());
    // if (this.operationType === 'add') {
    //   this.addbranch.push(new BranchModel());
    // }
  }
  removeBranch(index: number) {
    this.branches.removeAt(index);
    if (this.operationType === 'add') {
      this.addbranch.splice(index, 1);
    } else {
      this.updatebranch.splice(index, 1);
    }
  }
  BackToList() {
    this.resetComponent();
    this.router.navigate(['branch/list-branch']);
  }
  private resetComponent() {
    this.branchForm.reset();
    this.branch = [];
    this.addbranch = [];
    this.updatebranch = [];
  }
  //#endregion

  //#region Server Side Operation
  async submit(): Promise<void> {
    try {
      if (this.branchForm.valid) {
        this.isLoading = true;
        if (this.operationType === 'add') {
          this.branchSvcs.bulkCreateBranch(this.addbranch).subscribe({
            next: (response) => {
              if (response.responseCode === 201) {
                this.branchSvcs.setBulkBranch(response.data.records as BranchDto[], true);
                this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
                this.resetComponent();
                this.addBranch();
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
                  this.messageService.add({ severity: 'error', summary: 'Error', detail: errorMessages });
                }
                else {
                  this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.message });
                }
              }
              else {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error adding branches' });
              }
            }
          });
        }
        else {
          this.branchSvcs.bulkUpdateBranch(this.updatebranch).subscribe({
            next: (response) => {
              if (response.responseCode === 200) {
                this.branchSvcs.setBulkBranch(response.data.records as BranchDto[], true);
                this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
                this.resetComponent();
                this.addBranch();
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
                  this.messageService.add({ severity: 'error', summary: 'Error', detail: errorMessages });
                }
                else {
                  this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.message });
                }
              }
              else {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error adding branches' });
              }
            }
          });
        }
      }
    }
    catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An unexpected error occurred' });
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
  //#endregion
}
