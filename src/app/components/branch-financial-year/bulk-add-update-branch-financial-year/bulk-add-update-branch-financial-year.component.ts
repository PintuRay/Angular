import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { filter, Subscription } from 'rxjs';
import { BranchFinancialYearDto, BranchFinancialYearModel, BranchFinancialYearUpdateModel } from 'src/app/api/entity/branchFinancialYear';
import { AuthenticationService } from 'src/app/api/service/account/authentication/authentication.service';
import { BranchFinancialYearService } from 'src/app/api/service/devloper/branch-financial-year/branch-financial-year.service';
import { BranchService } from 'src/app/api/service/devloper/branch/branch.service';
import { FinancialYearService } from 'src/app/api/service/devloper/financial-year/financial-year.service';
import { LayoutService } from '../../shared/service/app.layout.service';
import { BranchDto } from 'src/app/api/entity/branch';
import { FinancialYearDto } from 'src/app/api/entity/financialYear';

@Component({
  selector: 'bulk-add-update-branch-financial-year',
  templateUrl: './bulk-add-update-branch-financial-year.component.html',
})
export class BulkAddUpdateBranchFinancialYearComponent {

  //#region Property Declaration
  public display: boolean;
  public visible: boolean;
  public isLoading: boolean;
  public operationType: string;
  private operationTypeSub: Subscription;
  private branchFinancialYearDataSub: Subscription;
  private dialogSub: Subscription;
  public branchFinancialYearForm: FormGroup;
  public branchFinancialYears: BranchFinancialYearDto[];
  private addBranchFinancialYears: BranchFinancialYearModel[];
  private updateBranchFinancialYears: BranchFinancialYearUpdateModel[];
  private branches: BranchDto[];
  private financialYears: FinancialYearDto[];
  public filteredBranches: BranchDto[];
  public filteredFinancialYears: FinancialYearDto[]
  //#endregion

  //#region constructor
  constructor(
    private fb: FormBuilder,
    public layoutSvcs: LayoutService,
    private authSvcs: AuthenticationService,
    private branchFinancialYearsSvcs: BranchFinancialYearService,
    private branchSvcs: BranchService,
    private financialYearSvcs: FinancialYearService,
    private messageService: MessageService) {
    this.display = false;
    this.visible = false;
    this.isLoading = false;
    this.operationType = '';
    this.operationTypeSub = new Subscription;
    this.branchFinancialYearDataSub = new Subscription;
    this.dialogSub = new Subscription;
    this.branchFinancialYearForm = this.initializeBranchFinancialYearForm();
    this.branchFinancialYears = [];
    this.addBranchFinancialYears = [];
    this.updateBranchFinancialYears = [];
    this.branches = [];
    this.financialYears = [];
    this.filteredBranches = [];
    this.filteredFinancialYears = [];
  }
  //#endregion

  //#region Lifecycle Hooks
  ngOnInit() {
    this.getAllBranch();
    this.getAllFinancialYears();
    this.dialogSub = this.branchFinancialYearsSvcs.changeBulkAddUpdateDialogVisibility$.subscribe(
      isVisible => {
        this.visible = isVisible;
      }
    );
    this.branchFinancialYearDataSub = this.branchFinancialYearsSvcs.getBulkBranchFinancialYear().subscribe((operation) => {
      if (operation?.branchFinancialYears != null && operation?.branchFinancialYears.length > 0) {
        this.branchFinancialYears = operation?.branchFinancialYears;
        while (this.branchFinancialYearArray.length) {
          this.branchFinancialYearArray.removeAt(0);
        }
        if (this.operationType === 'edit') {
          operation?.branchFinancialYears.forEach(bf => {
            const branchFinancialYearGroup = this.createBranchFinancialYearFormGroup();
            branchFinancialYearGroup.patchValue({
              branch: this.branches.find(c => c.branchId === bf.fk_BranchId),
              financialYear: this.financialYears.find(c => c.financialYearId === bf.fk_FinancialYearId),
            });
            this.branchFinancialYearArray.push(branchFinancialYearGroup);
          });
        }
      }
    });
    this.operationTypeSub = this.branchFinancialYearsSvcs.getBulkOperationType().pipe(filter(type => !!type)).subscribe((data) => {
      this.operationType = data;
      this.branchFinancialYearForm.valueChanges.subscribe((values) => {
        if (this.operationType === 'add') {
          this.addBranchFinancialYears = values.branchFinancialYears.map((item: any) => ({
            fk_BranchId: item.branch.branchId,
            fk_FinancialYearId: item.financialYear.financialYearId
          }));
        } else if (this.operationType === 'edit') {
          this.updateBranchFinancialYears = values.branchFinancialYears.map((item: any, index: number) => ({
            branchFinancialYearId: this.branchFinancialYears[index].branchFinancialYearId,
            fk_BranchId: item.branch.branchId,
            fk_FinancialYearId: item.financialYear.financialYearId
          }));
        }
      });
    });

    if (this.operationType === 'add') {
      this.addBranchFinancialYear();
    }
  }
  ngOnDestroy() {
    this.operationTypeSub?.unsubscribe();
    this.branchFinancialYearDataSub?.unsubscribe();
    this.dialogSub?.unsubscribe();
  }
  //#endregion

  //#region Form Initialization
  private initializeBranchFinancialYearForm(): FormGroup {
    return this.fb.group({
      branchFinancialYears: this.fb.array([])
    });
  }
  get branchFinancialYearArray() {
    return this.branchFinancialYearForm.get('branchFinancialYears') as FormArray;
  }
  createBranchFinancialYearFormGroup(): FormGroup {
    return this.fb.group({
      branch: ['', [Validators.required]],
      financialYear: ['', [Validators.required]],
    })
  }
  addBranchFinancialYear() {
    this.branchFinancialYearArray.push(this.createBranchFinancialYearFormGroup());
  }
  removeBranch(index: number) {
    this.branchFinancialYearArray.removeAt(index);
    if (this.operationType === 'add') {
      this.addBranchFinancialYears.splice(index, 1);
    } else {
      this.updateBranchFinancialYears.splice(index, 1);
    }
  }
  //#endregion

  //#region Client Side Validation
  private getFieldLabel(controlName: string): string {
    const labels: { [key: string]: string } = {
      branch: 'Branch Name',
      financialYear: 'Financial Year',
    };
    return labels[controlName] || controlName;
  }
  public getFormControl(index: number, controlName: string) {
    return this.branchFinancialYearArray.at(index).get(controlName);
  }
  isFieldInvalid(index: number, controlName: string): boolean {
    const control = this.getFormControl(index, controlName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }
  public getErrorMessage(index: number, controlName: string): string {
    const control = this.getFormControl(index, controlName);
    if (!control) return '';
    if (control.hasError('required')) {
      return `${this.getFieldLabel(controlName)} is required.`;
    }
    return '';
  }
  //#endregion

  //#region Client Side Operations
  filterBranches(event: any) {
    const query = event.query.toLowerCase();
    this.filteredBranches = this.branches.filter(branch =>
      branch.branchName.toLowerCase().includes(query)
    );
  }
  filterFinancialYears(event: any) {
    const query = event.query.toLowerCase();
    this.filteredFinancialYears = this.financialYears.filter(fy =>
      fy.financial_Year.toLowerCase().includes(query)
    );
  }
  public hideDialog() {
    this.branchFinancialYearsSvcs.hideBulkAddUpdateDialog();
    this.resetComponent();
  }
  private resetComponent() {
    this.branchFinancialYearForm.reset();
    this.branchFinancialYears = [];
    this.addBranchFinancialYears = [];
    this.updateBranchFinancialYears = [];
  }
  private handleBulkAddBrachError(err: any) {
    if (err.error.responseCode === 302) {
      const existingBranch = err.error.data as BranchDto[];
      existingBranch.forEach(branch => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `: ${branch.branchName} already exist`
        });
      });
    }
    else if (err.error.responseCode === 400) {
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
  private handleBulkUpdateBranchError(err: any) {
    if (err.error.responseCode === 404) {
      const notFoundBranches = err.error.data as BranchDto[];
      notFoundBranches.forEach(branch => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: `: ${branch.branchName} not found` });
      });
    }
    else if (err.error.responseCode === 400) {
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
  //#endregion

  //#region Server Side Operation
  private async getAllBranch(): Promise<void> {
    this.branchSvcs.getAll().subscribe({
      next: (response) => {
        if (response.responseCode == 200) {
          this.branches = response.data.collectionObjData as BranchDto[]
        }
      },
      error: (err) => {
        // this.handleError(err);
      }
    });
  }
  private async getAllFinancialYears(): Promise<void> {
    this.financialYearSvcs.getAll().subscribe({
      next: (response) => {
        if (response.responseCode == 200) {
          this.financialYears = response.data.collectionObjData as FinancialYearDto[]
        }
      },
      error: (err) => {
        //  this.handleError(err);
      }
    });
  }
  async submit(): Promise<void> {
    try {
      if (this.branchFinancialYearForm.dirty && this.branchFinancialYearForm.touched) {
        if (this.branchFinancialYearForm.valid) {
          this.isLoading = true;
          if (this.operationType === 'add') {
            this.branchFinancialYearsSvcs.bulkCreate(this.addBranchFinancialYears).subscribe({
              next: (response) => {
                if (response.responseCode === 201) {
                  this.branchFinancialYearsSvcs.setBulkBranchFinancialYear({ branchFinancialYears: response.data.records as BranchFinancialYearDto[], isSuccess: true , message : response.message});
                  this.hideDialog();
                  //this.addBranchFinancialYear();
                }
                this.isLoading = false;
              },
              error: (err) => {
                this.isLoading = false;
                this.handleBulkAddBrachError(err);
              }
            });
          }
          else {
            this.branchFinancialYearsSvcs.bulkUpdate(this.updateBranchFinancialYears).subscribe({
              next: (response) => {
                if (response.responseCode === 200) {
                  this.branchFinancialYearsSvcs.setBulkBranchFinancialYear({ branchFinancialYears: response.data.records as BranchFinancialYearDto[], isSuccess: true , message : response.message});
                  this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
                  this.hideDialog();
                  //this.addBranchFinancialYear();
                }
                this.isLoading = false;
              },
              error: (err) => {
                this.isLoading = false;
                this.handleBulkUpdateBranchError(err);
              }
            });
          }
        }
      }
      else {
        this.messageService.add({ severity: 'warn', summary: 'warn', detail: 'No Change Detected' });
      }

    }
    catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An unexpected error occurred' });
    }
  }
  //#endregion

  //#region Test form
  get formJson(): string {
    return JSON.stringify(this.branchFinancialYearForm.value, null, 2);
  }
  get branchFinancialYearJson(): string {
    return JSON.stringify(this.branchFinancialYears, null, 2);
  }
  get branchFinancialYearModelJson(): string {
    return JSON.stringify(this.addBranchFinancialYears, null, 2);
  }
  get branchFinancialYearUpdatemodelJson(): string {
    return JSON.stringify(this.updateBranchFinancialYears, null, 2);
  }
  //#endregion

}
