import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { BranchDto } from 'src/app/api/entity/branch';
import { FinancialYearDto } from 'src/app/api/entity/financialYear';
import { AuthenticationService } from 'src/app/api/service/account/authentication/authentication.service';
import { LayoutService } from '../../shared/service/app.layout.service';
import { BranchFinancialYearService } from 'src/app/api/service/devloper/branch-financial-year.service';
import { Component } from '@angular/core';
import { BranchService } from 'src/app/api/service/devloper/branch.service';
import { FinancialYearService } from 'src/app/api/service/devloper/financial-year.service';
import { BranchFinancialYearDto, BranchFinancialYearModel, BranchFinancialYearUpdateModel } from 'src/app/api/entity/branchFinancialYear';
import { Subscription } from 'rxjs';

@Component({
  selector: 'add-update-branch-financial-year',
  templateUrl: './add-update-branch-financial-year.component.html',
})
export class AddUpdateBranchFinancialYearComponent {

  //#region Property Declaration
  public display: boolean;
  public visible: boolean;
  public isLoading;
  public operationType: string;
  private dialogSub: Subscription;
  private branchFinanancialYearDataSub: Subscription;
  private operationTypeSub: Subscription;
  public branchFinancialYearForm: FormGroup;
  private branchFinancialyear: BranchFinancialYearDto;
  public addBranchFinancialYear: BranchFinancialYearModel;
  private updateBranchFinancialYear: BranchFinancialYearUpdateModel;
  private branches: BranchDto[];
  private financialYears: FinancialYearDto[];
  public filteredBranches: BranchDto[];
  public filteredFinancialYears: FinancialYearDto[];
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
    this.dialogSub = new Subscription;
    this.branchFinanancialYearDataSub = new Subscription;
    this.operationTypeSub = new Subscription;
    this.branchFinancialyear = new BranchFinancialYearDto();
    this.addBranchFinancialYear = new BranchFinancialYearModel();
    this.updateBranchFinancialYear = new BranchFinancialYearUpdateModel();
    this.branchFinancialYearForm = this.InitailizeForm();
    this.branches = [];
    this.financialYears = [];
    this.filteredBranches = [];
    this.filteredFinancialYears = [];
  }
  //#endregion

  //#region Lifecycle Hooks
  ngOnInit(): void {
    this.getAllBranch();
    this.getAllFinancialYears();
    this.dialogSub = this.branchFinancialYearsSvcs.changeAddUpdateDialogVisibility$.subscribe(
      isVisible => {
        this.visible = isVisible;
      }
    );
    this.branchFinanancialYearDataSub = this.branchFinancialYearsSvcs.getBranchFinanancialYear().subscribe((operation) => {
      if (operation?.branchFinancialYear != null) {
        this.branchFinancialyear = operation.branchFinancialYear;
        this.updateBranchFinancialYear.branchFinancialYearId = operation.branchFinancialYear.branchFinancialYearId;
        this.branchFinancialYearForm.patchValue({
          branch: this.branches.find(c => c.branchId === operation.branchFinancialYear?.fk_BranchId),
          financialYear: this.financialYears.find(c => c.financialYearId === operation.branchFinancialYear?.fk_FinancialYearId),
        });
      }
    });
    this.operationTypeSub = this.financialYearSvcs.getOperationType().subscribe((data) => {
      this.operationType = data;
      if (this.operationType === 'add') {
        this.branchFinancialYearForm.valueChanges.subscribe((data) => {
            this.addBranchFinancialYear.fk_BranchId = data.branch.value.branchId,
            this.addBranchFinancialYear.fk_FinancialYearId = data.financialYear.value.financialYearId
        });
      }
      else {
        this.branchFinancialYearForm.valueChanges.subscribe((data) => {
            this.updateBranchFinancialYear.fk_BranchId = data.branch.value.branchId,
            this.updateBranchFinancialYear.fk_FinancialYearId = data.financialYear.value.financialYearId
        });
      }
    });
  }
  ngOnDestroy() {
    this.dialogSub?.unsubscribe();
    this.operationTypeSub?.unsubscribe();
    this.branchFinanancialYearDataSub?.unsubscribe();
  }
  //#endregion

  //#region Themme
  get dark(): boolean {
    return this.layoutSvcs.config().colorScheme !== 'light';
  }
  //#endregion

  //#region Form Initialization
  private InitailizeForm() {
    return this.fb.group({
      branch: ['', [Validators.required]],
      financialYear: ['', [Validators.required]],
    })
  }
  //#endregion

  //#region Client Side Vaildation
  private getFieldLabel(controlName: string): string {
    const labels: { [key: string]: string } = {
      branch: 'Branch Name',
      financialYear: 'Financial Year',
    };
    return labels[controlName] || controlName;
  }
  private getFormControl(controlName: string) {
    return this.branchFinancialYearForm.get(controlName);
  }
  public isFieldInvalid(controlName: string): boolean {
    const control = this.getFormControl(controlName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }
  public getErrorMessage(controlName: string): string {
    const control = this.getFormControl(controlName);
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
    this.branchFinancialYearsSvcs.hideAddUpdateDialog();
    this.resetComponent();
  }
  private resetComponent() {
    this.branchFinancialYearForm.reset();
    this.operationType = '';
    this.branchFinancialyear = new BranchFinancialYearDto();
    this.addBranchFinancialYear = new BranchFinancialYearModel();
    this.updateBranchFinancialYear = new BranchFinancialYearUpdateModel();
  }
  private handleError(err: any) {
    switch (err.error.responseCode) {
      case 302:
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.message });
        break;
      case 404:
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.message });
        break;
      case 400:
        if (err.error?.data) {
          const messages = err.error.data.map((error: any) => {
            return {
              severity: 'error',
              summary: 'Error',
              detail: `${error.formattedMessagePlaceholderValues.PropertyName}: ${error.errorMessage}`
            };
          });
          this.messageService.addAll(messages);
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.message });
        }
        break;
      case 500:
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Internal server error' });
        break;
      default:
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An unexpected error occurred' });
        break;
    }
  }
  //#endregion 

  //#region Server Side Operations
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
    this.financialYearSvcs.getAllFinancialYears().subscribe({
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
  public submit(): void {
    if (this.branchFinancialYearForm.dirty && this.branchFinancialYearForm.touched) {
      if (this.branchFinancialYearForm.valid) {
        this.isLoading = true;
        if (this.operationType === 'add') {
          this.branchFinancialYearsSvcs.create(this.addBranchFinancialYear).subscribe({
            next: async (response) => {
              if (response.responseCode === 201) {
                this.branchFinancialyear = response.data.records as BranchFinancialYearDto;
                this.branchFinancialYearsSvcs.setBranchFinanancialYear({ branchFinancialYear: this.branchFinancialyear, isSuccess: true, message: response.message });
                this.hideDialog();
              }
              this.isLoading = false;
            },
            error: (err) => {
              this.isLoading = false;
              this.handleError(err);
            }
          })
        }
        else {
          this.branchFinancialYearsSvcs.update(this.updateBranchFinancialYear).subscribe({
            next: async (response) => {
              if (response.responseCode === 200) {
                this.branchFinancialyear = response.data.records as BranchFinancialYearDto;
                this.branchFinancialYearsSvcs.setBranchFinanancialYear({ branchFinancialYear: this.branchFinancialyear, isSuccess: true, message: response.message });
                this.hideDialog();
              }
              this.isLoading = false;
            },
            error: (err) => {
              this.isLoading = false;
              this.handleError(err);
            }
          })
        }
      }
      else {
        this.messageService.add({ severity: 'warn', summary: 'warn', detail: 'form is not valid' });
      }
    }
    else {
      this.messageService.add({ severity: 'warn', summary: 'warn', detail: 'No Change Detected' });
    }
  }
  //#endregion 

  //#region Test form
  get formJson(): string {
    return JSON.stringify(this.branchFinancialYearForm.value, null, 2);
  }
  get formErrors(): string {
    return JSON.stringify(this.branchFinancialYearForm.errors, null, 2);
  }
  get branchDtoJson(): string {
    return JSON.stringify(this.branches, null, 2);
  }
  get financialYearDtoJson(): string {
    return JSON.stringify(this.financialYears, null, 2);
  }
  get ModelData(): string {
    return JSON.stringify(this.addBranchFinancialYear, null, 2);
  }
  //#endregion 
}
