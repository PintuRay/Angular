import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FinancialYearDto, FinancialYearModel, FinancialYearUpdateModel } from 'src/app/api/entity/financialYear';
import { FinancialYearService } from 'src/app/api/service/devloper/financial-year.service';
import { LayoutService } from '../../shared/service/app.layout.service';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-add-update-financial-year',
  templateUrl: './add-update-financial-year.component.html',
})
export class AddUpdateFinancialYearComponent {
  
  //#region Property Declaration
  public display: boolean;
  public isLoading: boolean;
  public operationType: string;
  private finanancialYearDataSub: Subscription;
  private operationTypeSub: Subscription;
  private financialyear: FinancialYearDto;
  private addFinancialYear: FinancialYearModel;
  private updateFinancialYear: FinancialYearUpdateModel;
  public financialYearForm: FormGroup;
  //#endregion

  //#region constructor
  constructor(private fb: FormBuilder, private financialYearSvcs: FinancialYearService, public layoutSvcs: LayoutService, private messageService: MessageService) {
    this.display = false;
    this.isLoading = false;
    this.operationType = '';
    this.finanancialYearDataSub = new Subscription;
    this.operationTypeSub = new Subscription;
    this.financialYearForm = this.initializeForm();
    this.financialyear = new FinancialYearDto();
    this.addFinancialYear = new FinancialYearModel();
    this.updateFinancialYear = new FinancialYearUpdateModel()
  }
  //#endregion

  //#region Lifecycle Hooks
  ngOnInit() {
    this.finanancialYearDataSub = this.financialYearSvcs.getFinanancialYear().subscribe((operation) => {
      if (operation?.financialYear != null) {
        this.financialyear = operation.financialYear;
        this.updateFinancialYear.financialYearId = operation.financialYear.financialYearId;
        this.financialYearForm.patchValue({
          financial_Year: operation.financialYear.financial_Year,
          startDate: new Date(operation.financialYear.startDate),
          endDate: new Date(operation.financialYear.endDate),
        });
      }
    });
    this.operationTypeSub = this.financialYearSvcs.getOperationType().subscribe((data) => {
      this.operationType = data;
      if (this.operationType === 'edit') {
        this.financialYearForm.valueChanges.subscribe((values) => {
          this.updateFinancialYear = { ...this.updateFinancialYear, ...values };
        });
      }
      else {
        this.financialYearForm.valueChanges.subscribe((values) => {
          this.addFinancialYear = { ...this.addFinancialYear, ...values };
        });
      }
    });
  }
  ngOnDestroy() {
    this.finanancialYearDataSub?.unsubscribe();
    this.operationTypeSub?.unsubscribe();
  }
  //#endregion

  //#region Themme
  get dark(): boolean {
    return this.layoutSvcs.config().colorScheme !== 'light';
  }
  //#endregion

  //#region Form Initialization
  private initializeForm(fy?: FinancialYearUpdateModel): FormGroup {
    return this.fb.group({
      financial_Year: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
    })
  }
  //#endregion

  //#region Client Side Vaildation
  private getFieldLabel(controlName: string): string {
    const labels: { [key: string]: string } = {
      financial_Year: 'Financial Year',
      startDate: 'Start Date',
      endDate: 'End Date'
    };
    return labels[controlName] || controlName;
  }
  private getFormControl(controlName: string) {
    return this.financialYearForm.get(controlName);
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
  public resetComponent() {
    this.financialYearForm.reset();
    this.operationType = '';
    this.financialyear = new FinancialYearDto();
    this.addFinancialYear = new FinancialYearModel();
    this.updateFinancialYear = new FinancialYearUpdateModel();
  }
  //#endregion

  //#region Server Side Operation
  async submit(): Promise<void> {
    try {
      if (this.financialYearForm.dirty && this.financialYearForm.touched) {
        if (this.financialYearForm.valid) {
          this.isLoading = true;
          if (this.operationType === 'edit') {
            this.financialYearSvcs.updateFinancialYear(this.updateFinancialYear).subscribe({
              next: async (response) => {
                if (response.responseCode === 200) {
                  this.financialyear = {
                    ...this.updateFinancialYear,
                  };
                  this.financialYearSvcs.setfinancialYear({ financialYear: this.financialyear, isSuccess: true });
                  this.resetComponent();
                  this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
                }
                this.isLoading = false;
              },
              error: (err) => {
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
                  this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error updating  Financial Year' });
                }
              }
            })
          } else {
            this.financialYearSvcs.createFinancialYear(this.addFinancialYear).subscribe({
              next: async (response) => {
                if (response.responseCode === 201) {
                  this.financialyear = {
                    ...this.addFinancialYear,
                    financialYearId: response.data.id
                  };
                  this.financialYearSvcs.setfinancialYear({ financialYear: this.financialyear, isSuccess: true });
                  this.resetComponent();
                  this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
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
                  this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error adding Financial Year' });
                }
              }
            })
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
    return JSON.stringify(this.financialYearForm.value, null, 2);
  }
  get FinancialYearDtoJson(): string {
    return JSON.stringify(this.financialyear, null, 2);
  }
  get financialYearModelJson(): string {
    return JSON.stringify(this.addFinancialYear, null, 2);
  }
  get financialYearUpdateModelJson(): string {
    return JSON.stringify(this.updateFinancialYear, null, 2);
  }
  get formErrors(): string {
    return JSON.stringify(this.financialYearForm.errors, null, 2);
  }
  //#endregion
}
