import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, distinctUntilChanged, finalize, map, Observable, of, Subject, Subscription, switchMap, take, takeUntil, tap } from 'rxjs';
import { BranchDto, BranchMapper, BranchModel, BranchUpdateModel } from 'src/app/api/entity/branch';
import { CountryDto } from 'src/app/api/entity/country';
import { DistDto } from 'src/app/api/entity/dist';
import { StateDto } from 'src/app/api/entity/state';
import { BranchService } from 'src/app/api/service/devloper/branch/branch.service';
import { LayoutService } from '../../shared/service/app.layout.service';
import { AuthenticationService } from 'src/app/api/service/account/authentication/authentication.service';
import { CommonService } from 'src/app/api/service/common/common.service';
import { BranchMessageService } from 'src/app/api/service/devloper/branch/branch-message.service';
import { ConfirmationService } from 'primeng/api';
import { CanComponentDeactivate } from 'src/app/utility/guards/deactivate.guard';

@Component({
  selector: 'add-update-branch',
  templateUrl: './add-update-branch.component.html',
})
export class AddUpdateBranchComponent implements OnInit, OnDestroy, CanComponentDeactivate {

  //#region Property Declaration
  public display = false;
  public isLoading = false;
  public operationType = '';
  private readonly destroy$ = new Subject<void>();
  private branchDataSub: Subscription = new Subscription();
  private operationTypeSub: Subscription = new Subscription();
  private addbranch: BranchModel = new BranchModel();
  private updatebranch: BranchUpdateModel = new BranchUpdateModel();
  private countries: CountryDto[] = [];
  private states: StateDto[] = [];
  private dists: DistDto[] = [];
  public filteredCountries: CountryDto[] = [];
  public filteredStates: StateDto[] = [];
  public filteredDists: DistDto[] = [];
  public branchForm: FormGroup;
  get dark(): boolean {
    return this.layoutSvcs.config().colorScheme !== 'light';
  }
  //#endregion

  //#region constructor
  constructor(
    private fb: FormBuilder,
    private branchSvcs: BranchService,
    public layoutSvcs: LayoutService,
    private authSvcs: AuthenticationService,
    private commonSvcs: CommonService,
    private messageService: BranchMessageService,
    private confirmationService: ConfirmationService) {
    this.branchForm = this.initializeBranchForm();
  }
  //#endregion

  //#region Lifecycle Hooks
  ngOnInit() {
    this.setupOperationType();
    this.loadInitialData();
  }
  ngOnDestroy() {
    this.operationTypeSub?.unsubscribe();
    this.branchDataSub?.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }
  //#endregion

  //#region Guard
  canDeactivate(): Observable<boolean> {
    if (this.branchForm.dirty) {
      return new Observable<boolean>((observer) => {
        this.confirmationService.confirm({
          message: 'You have unsaved changes. Do you want to leave?',
          header: 'Confirm Navigation',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
            observer.next(true);
            observer.complete();
          },
          reject: () => {
            observer.next(false);
            observer.complete();
          }
        });
      });
    } else {
      return of(true);
    }
  }
  //#endregion

  //#region Form Initialization
  private initializeBranchForm(branch?: BranchUpdateModel): FormGroup {
    return this.fb.group({
      branchName: [branch?.branchName || '', [Validators.required, Validators.pattern(/^[A-Z\s]+$/)]],
      branchCode: [branch?.branchCode || '', [Validators.required, Validators.pattern(/^[A-Z][A-Za-z0-9]*$/)]],
      contactNumber: [branch?.contactNumber || '', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      address: this.fb.group({
        country: [branch?.address?.fk_CountryId && this.countries?.length ? this.countries.find(c => c.countryId === branch.address.fk_CountryId) : null, Validators.required],
        state: [branch?.address?.fk_StateId && this.states?.length ? this.states.find(s => s.stateId === branch.address.fk_StateId) : null, Validators.required],
        dist: [branch?.address?.fk_DistId && this.dists?.length ? this.dists.find(d => d.distId === branch.address.fk_DistId) : null, Validators.required],
        at: [branch?.address?.at || '', Validators.required],
        post: [branch?.address?.post || '', Validators.required],
        city: [branch?.address?.city || '', Validators.required],
        pinCode: [branch?.address?.pinCode || '', [Validators.pattern(/^\d{6}$/)]]
      })
    })
  }
  private loadInitialData() {
    this.getCountries().pipe(
      tap(countries => {
        this.countries = countries;
        this.filteredCountries = countries;
      }),
      switchMap(() => this.branchSvcs.getBranch().pipe(
        take(1),
        catchError(() => of({ branch: null }))
      )),
      switchMap(operation => {
        if (operation?.branch) {
          return this.handleEditMode(operation.branch);
        }
        return of(null);
      }),
      tap(() => {
        this.setupFormValueChanges();
      })
    ).subscribe();
  }
  private handleEditMode(branch: BranchDto): Observable<void> {
    return this.getStates(branch.address.fk_CountryId).pipe(
      switchMap(states => {
        this.states = states;
        this.filteredStates = states;
        if (branch.address.fk_StateId) {
          return this.getDists(branch.address.fk_StateId);
        }
        return of([] as DistDto[]);
      }),
      tap(dists => {
        this.dists = dists;
        this.filteredDists = dists;
        this.updatebranch = BranchMapper.dtoToUpdateModel(branch);
        this.branchForm = this.initializeBranchForm(this.updatebranch);
      }),
      map(() => void 0)
    );
  }
  private setupOperationType() {
    this.operationTypeSub = this.branchSvcs.getOperationType()
      .pipe(takeUntil(this.destroy$))
      .subscribe(operationType => {
        this.operationType = operationType;
      });
  }
  private setupFormValueChanges() {
    this.destroy$.next();
    this.branchForm.valueChanges.pipe(
      takeUntil(this.destroy$),
      distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr))
    ).subscribe(values => {
      if (this.operationType === 'edit') {
        this.updatebranch = {
          ...this.updatebranch,
          branchName: values.branchName,
          contactNumber: values.contactNumber,
          branchCode: values.branchCode,
          address: {
            ...this.updatebranch.address,
            fk_CountryId: values.address.country?.countryId,
            fk_StateId: values.address.state?.stateId,
            fk_DistId: values.address.dist?.distId,
            at: values.address.at,
            post: values.address.post,
            city: values.address.city,
            pinCode: values.address.pinCode,
          }
        };
      } else {
        this.addbranch = {
          branchName: values.branchName,
          contactNumber: values.contactNumber,
          branchCode: values.branchCode,
          address: {
            fk_CountryId: values.address.country?.countryId,
            fk_StateId: values.address.state?.stateId,
            fk_DistId: values.address.dist?.distId,
            fk_BranchId: null,
            fk_LabourId: null,
            fk_PartyId: null,
            fk_UserId: null,
            at: values.address.at,
            post: values.address.post,
            city: values.address.city,
            pinCode: values.address.pinCode,

          }
        };
      }
    });
  }
  //#endregion

  //#region Client Side Vaildation
  private getFieldLabel(controlName: string): string {
    const labels: { [key: string]: string } = {
      branchName: 'Branch Name',
      branchCode: 'Branch Code',
      contactNumber: 'Contact Number',
      country: 'Country',
      state: 'State',
      dist: 'District',
      at: 'At',
      post: 'Post',
      city: 'City',
      pinCode: 'Pin Code'
    };
    return labels[controlName] || controlName;
  }
  private getFormControl(controlName: string, groupName?: string) {
    if (groupName) {
      return this.branchForm.get([groupName, controlName]);
    }
    else {
      return this.branchForm.get(controlName);
    }
  }
  public isFieldInvalid(controlName: string, groupName?: string): boolean {
    const control = this.getFormControl(controlName, groupName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }
  public getErrorMessage(controlName: string, groupName?: string): string {
    const control = this.getFormControl(controlName, groupName);
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
  filterCountries(event: any) {
    const query = event.query.toLowerCase();
    this.filteredCountries = this.countries.filter(country =>
      country.countryName.toLowerCase().includes(query)
    );
  }
  filterStates(event: any) {
    const query = event.query.toLowerCase();
    this.filteredStates = this.states.filter(state =>
      state.stateName.toLowerCase().includes(query)
    );
  }
  filterDists(event: any) {
    const query = event.query.toLowerCase();
    this.filteredDists = this.dists.filter(dist =>
      dist.distName.toLowerCase().includes(query)
    );
  }
  onCountrySelect(event: any) {
    if (event?.value?.countryId) {
      this.getStates(event.value.countryId).pipe(
        tap(states => {
          this.states = states;
          this.filteredStates = states;
          this.dists = [];
          this.filteredDists = [];
        })
      ).subscribe(() => {
        this.branchForm.patchValue({
          address: {
            state: null,
            dist: null
          }
        });
      });
    }
  }
  onStateSelect(event: any) {
    if (event?.value?.stateId) {
      this.getDists(event.value.stateId).pipe(
        tap(dists => {
          this.dists = dists;
          this.filteredDists = dists;
        })
      ).subscribe(() => {
        this.branchForm.patchValue({
          address: {
            dist: null
          }
        });
      });
    }
  }
  private resetComponent() {
    this.branchForm.reset();
    this.addbranch = new BranchModel();
    this.updatebranch = new BranchUpdateModel();
  }
  //#endregion

  //#region Server Side Operation
  private getCountries(): Observable<CountryDto[]> {
    return this.commonSvcs.getCountries().pipe(
      takeUntil(this.destroy$),
      // tap(response => console.log('API Response:', response)),
      map(response => response.data.records as CountryDto[]),
      catchError(err => {
        this.countries = [];
        return of(this.countries);
      })
    );
  }
  private getStates(countryId: any): Observable<StateDto[]> {
    return this.commonSvcs.getStates(countryId).pipe(
      takeUntil(this.destroy$),
      //tap(response => console.log('API Response:', response)),
      map(response => response.data.records as StateDto[]),
      catchError(() => {
        this.states = [];
        return of(this.states);
      })
    );
  }
  private getDists(stateId: any): Observable<DistDto[]> {
    return this.commonSvcs.getDists(stateId).pipe(
      takeUntil(this.destroy$),
      //tap(response => console.log('API Response:', response)),
      map((response) => response.data.records as DistDto[]),
      catchError(() => {
        this.dists = [];
        return of(this.dists);
      })
    );
  }
  public submit(): void {
    if (this.branchForm.invalid) {
      this.branchForm.markAllAsTouched();
      return;
    }
    else {
      if (this.branchForm.dirty && this.branchForm.touched) {
        this.isLoading = true;
        const operation$ = this.operationType === 'edit' ? this.branchSvcs.update(this.updatebranch) : this.branchSvcs.create(this.addbranch);
        operation$.pipe(
          finalize(() => this.isLoading = false)
        ).subscribe({
          next: (response) => {
            if (response.responseCode === 200 || response.responseCode === 201) {
              this.messageService.success(response.message);
              this.branchForm.markAsPristine(); 
              this.branchForm.markAsUntouched();
              this.resetComponent();
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
    return JSON.stringify(this.branchForm.value, null, 2);
  }
  get AddOperationJson(): string {
    return JSON.stringify(this.addbranch, null, 2);
  }
  get UpdateOperationJson(): string {
    return JSON.stringify(this.updatebranch, null, 2);
  }
  get formErrors(): string {
    return JSON.stringify(this.branchForm.errors, null, 2);
  }
  //#endregion
}
