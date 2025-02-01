import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FinancialYearDto, FinancialYearModel, FinancialYearUpdateModel } from 'src/app/api/entity/financialYear';
import { FinancialYearService } from 'src/app/api/service/devloper/financial-year.service';
import { LayoutService } from '../../shared/service/app.layout.service';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-add-update-financial-year',
  templateUrl: './add-update-financial-year.component.html',
})
export class AddUpdateFinancialYearComponent {
  //#region Property Declaration
  public display: boolean = false;
  public operationType: string = '';
  private finanancialYearDataSub!: Subscription;
  private operationTypeSub!: Subscription;
  private financialyear: FinancialYearDto;
  private addFinancialYear: FinancialYearModel;
  private updateFinancialYear: FinancialYearUpdateModel;
  public financialYearForm: FormGroup;
  public isLoading: boolean = false;
  //#endregion

  //#region constructor
  constructor(
    private fb: FormBuilder, 
    private financialYearSvcs: FinancialYearService, 
    public layoutSvcs: LayoutService,
  ) {
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
          endDate: new Date(operation.financialYear.endDate) ,
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
  private initializeForm(fy?:FinancialYearUpdateModel): FormGroup {
    return this.fb.group({
      financial_Year: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
    })
  }
  //#endregion

  //#region Client Side Vaildation
  get financialYearControl() {
    return this.financialYearForm.get('financial_Year');
  }
  getFinancialYearErrorMessage() {
    if (this.financialYearControl?.hasError('required')) {
      return 'FinancialYear is Required.';
    }
    else {
      return '';
    }
  }
  get startDateControl() {
    return this.financialYearForm.get('startDate');
  }
  getStartDateErrorMessage() {
    if (this.startDateControl?.hasError('required')) {
      return 'Start Date is Required.';
    }
    else {
      return '';
    }
  }
  get endDateControl() {
    return this.financialYearForm.get('endDate');
  }
  getEndDateErrorMessage() {
    if (this.endDateControl?.hasError('required')) {
      return 'End Date is Required.';
    }
    else {
      return '';
    }
  }
  //#endregion

  //#region Client Side Operations
  public resetComponent() {
    this.financialYearForm.reset();
    this.financialyear = new FinancialYearDto();
    this.addFinancialYear = new FinancialYearModel();
    this.updateFinancialYear = new FinancialYearUpdateModel()
  }

  private getDate(){

  }
  //#endregion
  //#region Server Side Operation
  async submit(): Promise<void> {
    try {
      if (this.financialYearForm.valid) {
        this.isLoading = true;
        if (this.operationType === 'edit') {
          this.financialYearSvcs.updateFinancialYear(this.updateFinancialYear).subscribe({
            next: (response) => {
              if (response.responseCode == 200) {
                this.financialyear = {
                  ...this.updateFinancialYear,
                };
                this.financialYearSvcs.setfinancialYear(this.financialyear, true);
                this.resetComponent();
              }
              this.isLoading = false;
            },
            error: (response) => {
              this.isLoading = false;
            }
          })

         
        } else {
          this.financialYearSvcs.createFinancialYear(this.addFinancialYear).subscribe({
            next: (response) => {
              if (response.responseCode === 201) {
                this.financialyear = {
                  ...this.addFinancialYear,
                  financialYearId: response.data.id
                };
                this.financialYearSvcs.setfinancialYear(this.financialyear, true);
               this.resetComponent();
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
