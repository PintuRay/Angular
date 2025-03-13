import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, distinctUntilChanged, filter, finalize, forkJoin, map, Observable, of, Subject, switchMap, take, takeUntil, tap } from 'rxjs';
import { BranchDto } from 'src/app/api/entity/branch';
import { BulkFinancialYearOperation, FinancialYearDto, FinancialYearMapper, FinancialYearModel, FinancialYearUpdateModel } from 'src/app/api/entity/financialYear';
import { FinancialYearService } from 'src/app/api/service/devloper/financial-year/financial-year.service';
import { LayoutService } from '../../shared/service/app.layout.service';
import { CommonService } from 'src/app/api/service/common/common.service';
import { FinancialYearMessageService } from 'src/app/api/service/devloper/financial-year/financial-year-messsage.service';

@Component({
  selector: 'bulk-add-update-financial-year',
  templateUrl: './bulk-add-update-financial-year.component.html',
})
export class BulkAddUpdateFinancialYearComponent {
  //#region Property Declaration
  public display: boolean = false;
  public visible: boolean = false;
  public isLoading: boolean = false;
  public operationType = '';
  private readonly destroy$ = new Subject<void>();
  private addFinancialYears: FinancialYearModel[] = [];
  private updateFinancialYears: FinancialYearUpdateModel[] = [];
  public financialYearForm: FormGroup;
  private branches: BranchDto[] = [];
  public filteredBranches: BranchDto[] = [];
  public yearRange: string = `1800:${new Date().getFullYear() + 1}`;
  public maxDate: Date = new Date(new Date().getFullYear() + 1, 11, 31);
  //#endregion

  //#region constructor
  constructor(
    private fb: FormBuilder,
    private financialYearSvcs: FinancialYearService,
    public layoutSvcs: LayoutService,
    private commonSvcs: CommonService,
    private messageService: FinancialYearMessageService
  ) {
    this.financialYearForm = this.initializeFinancialYearForm();
  }
  //#endregion

  //#region Lifecycle Hooks
  ngOnInit() {
    this.loadInitialData();
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  //#endregion

  //#region Form Initialization
  private initializeFinancialYearForm(): FormGroup {
    return this.fb.group({
      financialYears: this.fb.array([])
    });
  }
  get financialYearArray() {
    return this.financialYearForm.get('financialYears') as FormArray;
  }
  createFinancialYearFormGroup(): FormGroup {
    return this.fb.group({
      branch: [null, Validators.required],
      financial_Year: ['', [Validators.required]],
      startDate: [null, [Validators.required]],
      endDate: [null, [Validators.required]],
    })
  }
  addFinancialYear() {
    this.financialYearArray.push(this.createFinancialYearFormGroup());
  }
  removeFinancialYear(index: number) {
    this.financialYearArray.removeAt(index);
    if (this.operationType === 'add') {
      this.addFinancialYears.splice(index, 1);
    } else {
      this.updateFinancialYears.splice(index, 1);
    }
  }
  private loadInitialData() {
    this.getAllBranch().pipe(
      tap(branches => {
        this.branches = branches;
        this.filteredBranches = branches;
      }),
      switchMap(() => this.financialYearSvcs.changeBulkAddUpdateDialogVisibility$.pipe(
        takeUntil(this.destroy$),
        filter(isVisible => isVisible === true),
        tap(isVisible => {
          this.visible = isVisible;
        }),
        switchMap(() => this.financialYearSvcs.getBulkOperationType().pipe(
          take(1),
          tap(operationType => this.operationType = operationType),
        )),
        switchMap(() => this.financialYearSvcs.getBulkFinancialYear().pipe(
          take(1),
          map(response => response || { financialYears: [] }),
          catchError(() => of({ financialYears: null }))
        )),
        switchMap((operation: BulkFinancialYearOperation) => {
          if (operation?.financialYears && operation.financialYears.length > 0) {
            return this.handleEditMode(operation.financialYears);
          }
          return of(null);
        }),
        tap(() => {
          if (this.financialYearArray.length === 0) {
            this.addFinancialYear();
          }
          this.setupFormValueChanges();
        })
      ))
    ).subscribe();
  }
  private handleEditMode(financialYears: FinancialYearDto[]): Observable<void> {
    financialYears.forEach(fy => {
      const financialYearGroup = this.createFinancialYearFormGroup();
      this.patchBranchForm(financialYearGroup, fy);
      this.financialYearArray.push(financialYearGroup);
      this.updateFinancialYears.push(FinancialYearMapper.dtoToUpdateModel(fy));
    });
    return of(void 0);
  }
  private patchBranchForm(formGroup: FormGroup, financialyear: FinancialYearDto) {
    formGroup.patchValue({
      branch: this.branches.find(c => c.branchId === financialyear.fk_BranchId),
      financial_Year: financialyear.financial_Year,
      startDate: new Date(financialyear.startDate),
      endDate:  new Date(financialyear.endDate),
    });
  }
  private setupFormValueChanges() {
    this.destroy$.next();
    this.financialYearForm.valueChanges.pipe(
      takeUntil(this.destroy$),
      distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr))
    ).subscribe(values => {
      values.financialYears.forEach((financialYear: any, index: number) => {
        if (this.operationType === 'edit') {
          this.updateFinacialyearModel(financialYear, index);
        } else {
          this.updateAddFinacialyearModel(financialYear, index);
        }
      });
    });
  }
  private updateFinacialyearModel(fy: any, index: number) {
    if (index >= this.updateFinancialYears.length) {
      this.updateFinancialYears[index] = new FinancialYearUpdateModel();
    }
    this.updateFinancialYears[index] = {
      ...this.updateFinancialYears[index],
      fk_BranchId: fy.branch.branchId,
      financial_Year: fy.financial_Year,
      startDate: fy.startDate,
      endDate: fy.endDate,
    };
  }
  private updateAddFinacialyearModel(fy: any, index: number) {
    if (index >= this.addFinancialYears.length) {
      this.addFinancialYears[index] = new FinancialYearModel();
    }
    this.addFinancialYears[index] = {
      fk_BranchId: fy.branch.branchId,
      financial_Year: fy.financial_Year,
      startDate: fy.startDate,
      endDate: fy.endDate,
    }
  }
  //#endregion

  //#region Client Side Validation
  private getFieldLabel(controlName: string): string {
    const labels: { [key: string]: string } = {
      branch: 'Branch',
      financial_Year: 'Financial Year',
      startDate: 'Start Date',
      endDate: 'End Date',
    };
    return labels[controlName] || controlName;
  }
  public getFormControl(index: number, controlName: string) {
    return this.financialYearArray.at(index).get(controlName);
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
  private resetComponent() {
    this.financialYearForm.reset();
    this.addFinancialYears = [];
    this.updateFinancialYears = [];
    this.visible = false;
    this.financialYearArray.clear();
    this.addFinancialYear();
  }
  public hideDialog() {
    this.financialYearSvcs.hideAddUpdateDialog();
    this.resetComponent();
  }
  //#endregion

  //#region Server Side Operation
  private getAllBranch(): Observable<BranchDto[]> {
    return this.commonSvcs.getBranches().pipe(
      takeUntil(this.destroy$),
      map(response => response.data as BranchDto[]),
      catchError(err => {
        this.branches = [];
        return of(this.branches);
      })
    );
  }
   public submit(): void {
      if (this.financialYearForm.invalid) {
        this.financialYearForm.markAllAsTouched();
        return;
      }
  
      if (this.financialYearForm.dirty && this.financialYearForm.touched) {
        this.isLoading = true;
        const operation$ = this.operationType === 'edit' ? this.financialYearSvcs.bulkUpdate(this.updateFinancialYears) : this.financialYearSvcs.bulkCreate(this.addFinancialYears);
        operation$.pipe(
          finalize(() => this.isLoading = false)
        ).subscribe({
          next: (response) => {
            if (response.responseCode === 200 || response.responseCode === 201) {
              this.financialYearSvcs.setBulkFinancialYear({ financialYears: response.data, isSuccess: true, message: response.message });
              this.hideDialog();
            }
          },
          error: () => {
            this.messageService.error('Operation failed');
          }
        });
      } else {
        this.messageService.info('No Change Detected');
      }
    }
  //#endregion
  
  //#region Test form
  get formJson(): string {
    return JSON.stringify(this.financialYearForm.value, null, 2);
  }
  get branchFinancialYearModelJson(): string {
    return JSON.stringify(this.addFinancialYears, null, 2);
  }
  get branchFinancialYearUpdatemodelJson(): string {
    return JSON.stringify(this.updateFinancialYears, null, 2);
  }
  get formErrors(): string {
    return JSON.stringify(this.financialYearForm.errors, null, 2);
  }
  //#endregion
}
