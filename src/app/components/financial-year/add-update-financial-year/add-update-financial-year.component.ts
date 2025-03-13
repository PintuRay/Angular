import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, distinctUntilChanged, filter, finalize, map, Observable, of, Subject, switchMap, take, takeUntil, tap } from 'rxjs';
import { FinancialYearDto, FinancialYearMapper, FinancialYearModel, FinancialYearUpdateModel } from 'src/app/api/entity/financialYear';
import { FinancialYearService } from 'src/app/api/service/devloper/financial-year/financial-year.service';
import { LayoutService } from '../../shared/service/app.layout.service';
import { ConfirmationService } from 'primeng/api';
import { BranchDto } from 'src/app/api/entity/branch';
import { FinancialYearMessageService } from 'src/app/api/service/devloper/financial-year/financial-year-messsage.service';
import { CommonService } from 'src/app/api/service/common/common.service';
@Component({
  selector: 'add-update-financial-year',
  templateUrl: './add-update-financial-year.component.html',
})
export class AddUpdateFinancialYearComponent {
  //#region Property Declaration
  public display: boolean = false;
  public visible: boolean = false;
  public isLoading = false;
  public operationType = '';
  private readonly destroy$ = new Subject<void>();
  private addFinancialYear: FinancialYearModel = new FinancialYearModel();
  private updateFinancialYear: FinancialYearUpdateModel = new FinancialYearUpdateModel();
  public financialYearForm: FormGroup;
  private branches: BranchDto[] = [];
  public filteredBranches: BranchDto[] = [];
  public yearRange: string = `1800:${new Date().getFullYear() + 1}`;
  public maxDate: Date = new Date(new Date().getFullYear() + 1, 11, 31);
  //#endregion

  //#region constructor
  constructor(private fb: FormBuilder,
    private financialYearSvcs: FinancialYearService,
    public layoutSvcs: LayoutService,
    private commonSvcs: CommonService,
    private messageService: FinancialYearMessageService) {
    this.financialYearForm = this.initializeForm();
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
  private initializeForm(fy?: FinancialYearUpdateModel): FormGroup {
    return this.fb.group({
      branch: [fy?.fk_BranchId && this.branches?.length ? this.branches.find(c => c.branchId === fy.fk_BranchId) : null, Validators.required],
      financial_Year: [fy?.financial_Year || '', [Validators.required]],
      startDate: [fy?.startDate ? new Date(fy.startDate) : null, [Validators.required]],
      endDate: [fy?.endDate ? new Date(fy.endDate) : null, [Validators.required]],
    })
  }
  private loadInitialData() {
    this.getAllBranch().pipe(
      tap(branches => {
        this.branches = branches;
        this.filteredBranches = branches;
      }),
      switchMap(() => this.financialYearSvcs.changeAddUpdateDialogVisibility$.pipe(
        takeUntil(this.destroy$),
        filter(isVisible => isVisible === true),
        tap(isVisible => {
          this.visible = isVisible;
        }),
        switchMap(() => this.financialYearSvcs.getOperationType().pipe(take(1))),
        tap(operationType => {
          this.operationType = operationType;
        }),
        switchMap(() => this.financialYearSvcs.getFinancialYear().pipe(
          take(1),
          catchError(() => of({ financialYear: null }))
        ))
      )),
      switchMap(operation => {
        if (operation?.financialYear) {
          return this.handleEditMode(operation.financialYear);
        }
        return of(null);
      }),
      tap(() => {
        this.setupFormValueChanges();
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  private handleEditMode(fy: FinancialYearDto): Observable<void> {
    this.updateFinancialYear = FinancialYearMapper.dtoToUpdateModel(fy);
    this.financialYearForm = this.initializeForm(this.updateFinancialYear);
    return of(undefined);
  }
  private setupFormValueChanges() {
    this.destroy$.next();
    this.financialYearForm.valueChanges.pipe(
      takeUntil(this.destroy$),
      distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr))
    ).subscribe(values => {
      if (this.operationType === 'edit') {
        this.updateFinancialYear = {
          ...this.updateFinancialYear,
          fk_BranchId: values.branch?.branchId,
          financial_Year: values.financial_Year,
          startDate: values.startDate,
          endDate: values.endDate,
        };
      } else {
        if (this.operationType === 'add') {
          this.addFinancialYear = {
            fk_BranchId: values.branch?.branchId,
            financial_Year: values.financial_Year,
            startDate: values.startDate,
            endDate: values.endDate,
          };
        }
      }
    });
  }
  //#endregion

  //#region Client Side Vaildation
  private getFieldLabel(controlName: string): string {
    const labels: { [key: string]: string } = {
      branch: 'Branch',
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
  filterBranches(event: any) {
    const query = event.query.toLowerCase();
    this.filteredBranches = this.branches.filter(branch =>
      branch.branchName.toLowerCase().includes(query)
    );
  }
  private resetComponent() {
    this.financialYearForm.reset();
    this.addFinancialYear = new FinancialYearModel();
    this.updateFinancialYear = new FinancialYearUpdateModel();
    this.visible = false;
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
    else {
      if (this.financialYearForm.dirty && this.financialYearForm.touched) {
        this.isLoading = true;
        const operation$ = this.operationType === 'edit' ? this.financialYearSvcs.update(this.updateFinancialYear) : this.financialYearSvcs.create(this.addFinancialYear);
        operation$.pipe(
          finalize(() => this.isLoading = false)
        ).subscribe({
          next: (response) => {
            if (response.responseCode === 200 || response.responseCode === 201) {
              this.financialYearSvcs.setFinancialYear({ financialYear: response.data, isSuccess: true, message: response.message });
              this.hideDialog();
            }
          },
          error: (error) => {
            this.messageService.error('Operation failed');
          }
        });
      }
      else {
        this.messageService.info('No Change Detected');
      }
    }
  }
  //#endregion

  //#region Test form
  get formJson(): string {
    return JSON.stringify(this.financialYearForm.value, null, 2);
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
