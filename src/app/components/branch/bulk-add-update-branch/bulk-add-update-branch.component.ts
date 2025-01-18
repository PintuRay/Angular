import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { BranchService } from 'src/app/api/service/devloper/branch.service';
import { LayoutService } from '../../shared/service/app.layout.service';
import { BranchModel, BranchUpdateModel } from 'src/app/api/entity/branch';

@Component({
  selector: 'app-bulk-add-update-branch',
  templateUrl: './bulk-add-update-branch.component.html',

})
export class BulkAddUpdateBranchComponent {
  //#region Property Declaration
  display: boolean = false;
  private operationTypeSub!: Subscription;
  operationType: string = '';
  branchForm: FormGroup;
  addbranch: BranchModel[] = [];
  updatebranch: BranchUpdateModel[] = [];
  //#endregion

  //#region constructor
  constructor(
    private fb: FormBuilder,
    private branchSvcs: BranchService,
    public layoutSvcs: LayoutService,
  ) {
    this.branchForm = this.initializeBranchForm();
  }
  //#endregion

  //#region Lifecycle Hooks
  ngOnInit() {
    this.operationTypeSub = this.branchSvcs.getOperationType().subscribe((data) => {
      this.operationType = data;
    });

    this.addBranch();

  }
  ngOnDestroy() {
    this.operationTypeSub?.unsubscribe();
  }
  //#endregion

  //#region Form Initialization
  private initializeBranchForm(): FormGroup {
    return this.fb.group({
      branches: this.fb.array([])
    });
  }
  get branches() {
    return this.branchForm.get('branches') as FormArray;
  }
  createBranchFormGroup(): FormGroup {
    return this.fb.group({
      branchCode: ['', [Validators.required]],
      branchName: ['', [Validators.required]],
      branchAddress: ['', [Validators.required]],
      contactNumber: ['', [Validators.required]],
    });
  }
  addBranch() {
    this.branches.push(this.createBranchFormGroup());
  }
  removeBranch(index: number) {
    this.branches.removeAt(index);
  }
  //#endregion
  onSubmit() {
    if (this.branchForm.valid) {
      // const branchData = this.branchForm.value.branches;
      // this.branchSvcs.bulkAddBranches(branchData).subscribe({
      //   next: (response) => {
      //     // Handle success
      //     console.log('Branches added successfully', response);
      //     // Clear form after successful submission
      //     this.branchForm = this.initializeBranchForm();
      //     this.addBranch();
      //   },
      //   error: (error) => {
      //     // Handle error
      //     console.error('Error adding branches', error);
      //   }
      // });
    }
  }
  get formJson(): string {
    return JSON.stringify(this.branchForm.value, null, 2);
  }
  get branchModelJson(): string {
    return JSON.stringify(this.addbranch, null, 2);
  }
  get BranchUpdatemodelJson(): string {
    return JSON.stringify(this.updatebranch, null, 2);
  }
}
