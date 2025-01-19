import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { filter, Subscription } from 'rxjs';
import { BranchService } from 'src/app/api/service/devloper/branch.service';
import { LayoutService } from '../../shared/service/app.layout.service';
import { Branch, BranchModel, BranchUpdateModel } from 'src/app/api/entity/branch';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-bulk-add-update-branch',
  templateUrl: './bulk-add-update-branch.component.html',
})
export class BulkAddUpdateBranchComponent {
  //#region Property Declaration
  display: boolean = false;
  operationType: string = '';
  private operationTypeSub!: Subscription;
  private branchDataSub!: Subscription;
  branch: Branch[];
  addbranch: BranchModel[];
  updatebranch: BranchUpdateModel[];
  branchForm: FormGroup;
  isLoading: boolean = false;
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
    this.branchDataSub = this.branchSvcs.getBulkBranch().subscribe((branches) => {
      if (branches != null && branches.length > 0) {
        this.branch = branches;
        while (this.branches.length) {
          this.branches.removeAt(0);
        }
        if (this.operationType === 'edit') {
          branches.forEach(branch => {
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

  //#region Client Side Operations
  get branches() {
    return this.branchForm.get('branches') as FormArray;
  }
  createBranchFormGroup(): FormGroup {
    return this.fb.group({
      branchId: [''],
      branchCode: ['', [Validators.required]],
      branchName: ['', [Validators.required]],
      branchAddress: ['', [Validators.required]],
      contactNumber: ['', [Validators.required]],
    });
  }
  addBranch() {
    this.branches.push(this.createBranchFormGroup());
    if (this.operationType === 'add') {
      this.addbranch.push(new BranchModel());
    }
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
    this.router.navigate(['branch/list-branch']);
  }
  //#endregion

  //#region Server Side Operation
  async submit(): Promise<void> {
    try{
      if (this.branchForm.valid) {
        if (this.operationType === 'add') {
          this.branchSvcs.bulkCreateBranch(this.addbranch).subscribe({
            next: (response) => {
              if(response.responseCode === 201){
                this.branchSvcs.setBulkBranch(response.data.records as Branch[]);
                this.messageService.add({severity: 'success',  summary: 'Success',detail: response.message});
                this.branchForm = this.initializeBranchForm();
                this.addBranch();
              }   
            },
            error: (error) => {
              this.messageService.add({severity: 'error',summary: 'Error',detail: 'Error adding branches' });
            }
          });
        }
        else{
          this.branchSvcs.bulkUpdateBranch(this.updatebranch).subscribe({
            next: (response) => {
              if(response.responseCode === 200){
                this.branchSvcs.setBulkBranch(response.data.records as Branch[]);
                this.messageService.add({severity: 'success',summary: 'Success',detail: response.message});
                this.branchForm = this.initializeBranchForm();
                this.addBranch();
              }
            },
            error: (error) => {
              this.messageService.add({severity: 'error',summary: 'Error',detail: 'Error updating branches' });
            }
          });
        }
      }
    }
    catch(error){
      this.messageService.add({ severity: 'error',summary: 'Error',detail: 'An unexpected error occurred'});
      console.error('Unexpected error', error);
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
