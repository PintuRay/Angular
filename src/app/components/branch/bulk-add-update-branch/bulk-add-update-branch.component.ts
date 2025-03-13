import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, distinctUntilChanged, filter, finalize, forkJoin, map, Observable, of, Subject, Subscription, switchMap, take, takeUntil, tap } from 'rxjs';
import { BranchService } from 'src/app/api/service/devloper/branch/branch.service';
import { LayoutService } from '../../shared/service/app.layout.service';
import { BranchDto, BranchMapper, BranchModel, BranchUpdateModel, BulkBranchOperation } from 'src/app/api/entity/branch';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/api/service/common/common.service';
import { CountryDto } from 'src/app/api/entity/country';
import { StateDto } from 'src/app/api/entity/state';
import { DistDto } from 'src/app/api/entity/dist';
import { BranchMessageService } from 'src/app/api/service/devloper/branch/branch-message.service';
import { AuthenticationService } from 'src/app/api/service/account/authentication/authentication.service';
import { ConfirmationService } from 'primeng/api';
import { CanComponentDeactivate } from 'src/app/utility/guards/deactivate.guard';

@Component({
  selector: 'app-bulk-add-update-branch',
  templateUrl: './bulk-add-update-branch.component.html',
})
export class BulkAddUpdateBranchComponent implements OnInit, OnDestroy, CanComponentDeactivate {

  //#region Property Declaration
  public display = false;
  public isLoading = false;
  public operationType = '';
  private readonly destroy$ = new Subject<void>();
  private countries: CountryDto[] = [];
  private states: StateDto[] = [];
  private dists: DistDto[] = [];
  public filteredCountries: CountryDto[] = [];
  public filteredStates: StateDto[] = [];
  public filteredDists: DistDto[] = [];
  public branchForm: FormGroup;
  private addbranch: BranchModel[] = [];
  private updatebranch: BranchUpdateModel[] = [];

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
    private confirmationService: ConfirmationService
  ) {
    this.branchForm = this.initializeBranchForm();
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
    }
    return of(true);
  }
  //#endregion

  //#region Form Initialization
  private initializeBranchForm(): FormGroup {
    return this.fb.group({
      branches: this.fb.array([])
    });
  }
  public addBranch() {
    this.branchesArray.push(this.createBranchFormGroup());
  }
  public removeBranch(index: number) {
    this.branchesArray.removeAt(index);
    if (this.operationType === 'add') {
      this.addbranch.splice(index, 1);
    } else {
      this.updatebranch.splice(index, 1);
    }
  }
  private createBranchFormGroup(): FormGroup {
    return this.fb.group({
      branchName: ['', [Validators.required, Validators.pattern(/^[A-Z\s]+$/)]],
      branchCode: ['', [Validators.required, Validators.pattern(/^[A-Z][A-Za-z0-9]*$/)]],
      contactNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      address: this.fb.group({
        country: [null, Validators.required],
        state: [null, Validators.required],
        dist: [null, Validators.required],
        at: ['', Validators.required],
        post: ['', Validators.required],
        city: ['', Validators.required],
        pinCode: ['', [Validators.pattern(/^\d{6}$/)]]
      })
    });
  }
  get branchesArray() {
    return this.branchForm.get('branches') as FormArray;
  }
  private loadInitialData() {
    this.getCountries().pipe(
      tap(countries => {
        this.countries = countries;
      }),
      switchMap(() => this.branchSvcs.getBulkOperationType().pipe(take(1))),
      tap(operationType => {
        this.operationType = operationType;
      }),
      switchMap(() => this.branchSvcs.getBulkBranch().pipe(
        take(1),
        map(response => response || { branches: [] }),
        catchError(() => of({ branches: [] }))
      )),
      switchMap((operation: BulkBranchOperation) => {
        if (operation?.branches && operation.branches.length > 0) {
          return this.handleEditMode(operation.branches);
        }
        return of(null);
      }),
      tap(() => {
        if (this.branchesArray.length === 0) {
          this.addBranch();
        }
        this.setupFormValueChanges();
      })
    ).subscribe();
  }
  private handleEditMode(branches: BranchDto[]): Observable<void> {
    const operations$ = branches.map(branch =>
      this.getStates(branch.address.fk_CountryId).pipe(
        switchMap(states => {
          this.states = states;
          return this.getDists(branch.address.fk_StateId);
        }),
        tap(dists => {
          this.dists = dists;
          const branchGroup = this.createBranchFormGroup();
          this.patchBranchForm(branchGroup, branch);
          this.branchesArray.push(branchGroup);
          this.updatebranch.push(BranchMapper.dtoToUpdateModel(branch));
        })
      )
    );
    return forkJoin(operations$).pipe(map(() => void 0));
  }
  private patchBranchForm(formGroup: FormGroup, branch: BranchDto) {
    formGroup.patchValue({
      branchName: branch.branchName,
      branchCode: branch.branchCode,
      contactNumber: branch.contactNumber,
      address: {
        country: this.countries.find(c => c.countryId === branch.address.fk_CountryId),
        state: this.states.find(s => s.stateId === branch.address.fk_StateId),
        dist: this.dists.find(d => d.distId === branch.address.fk_DistId),
        at: branch.address.at,
        post: branch.address.post,
        city: branch.address.city,
        pinCode: branch.address.pinCode
      }
    });
  }
  private setupFormValueChanges() {
    this.destroy$.next();
    this.branchForm.valueChanges.pipe(
      takeUntil(this.destroy$),
      distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr))
    ).subscribe(values => {
      values.branches.forEach((branch: any, index: number) => {
        if (this.operationType === 'edit') {
          this.updateBranchModel(branch, index);
        } else {
          this.updateAddBranchModel(branch, index);
        }
      });
    });
  }
  private updateBranchModel(branch: any, index: number) {
    if (index >= this.updatebranch.length) {
      this.updatebranch[index] = new BranchUpdateModel();
    }
    this.updatebranch[index] = {
      ...this.updatebranch[index],
      branchName: branch.branchName,
      contactNumber: branch.contactNumber,
      branchCode: branch.branchCode,
      address: {
        ...this.updatebranch[index].address,
        fk_CountryId: branch.address.country?.countryId,
        fk_StateId: branch.address.state?.stateId,
        fk_DistId: branch.address.dist?.distId,
        at: branch.address.at,
        post: branch.address.post,
        city: branch.address.city,
        pinCode: branch.address.pinCode,
      }
    };
  }
  private updateAddBranchModel(branch: any, index: number) {
    if (index >= this.addbranch.length) {
      this.addbranch[index] = new BranchModel();
    }
    this.addbranch[index] = {
      branchName: branch.branchName,
      contactNumber: branch.contactNumber,
      branchCode: branch.branchCode,
      address: {
        fk_CountryId: branch.address.country?.countryId,
        fk_StateId: branch.address.state?.stateId,
        fk_DistId: branch.address.dist?.distId,
        at: branch.address.at,
        post: branch.address.post,
        city: branch.address.city,
        pinCode: branch.address.pinCode,
      }
    }
  }
  //#endregion

  //#region Client Side Validation
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

  private getFormControl(index: number, controlName: string, groupName?: string) {
    const branchGroup = this.branchesArray.at(index);
    return groupName ? branchGroup.get([groupName, controlName]) : branchGroup.get(controlName);
  }

  public isFieldInvalid(index: number, controlName: string, groupName?: string): boolean {
    const control = this.getFormControl(index, controlName, groupName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  public getErrorMessage(index: number, controlName: string, groupName?: string): string {
    const control = this.getFormControl(index, controlName, groupName);
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
  filterCountries(event: any, index: number) {
    const query = event.query.toLowerCase();
    this.filteredCountries = this.countries.filter(country =>
      country.countryName.toLowerCase().includes(query)
    );
  }

  filterStates(event: any, index: number) {
    const query = event.query.toLowerCase();
    this.filteredStates = this.states.filter(state =>
      state.stateName.toLowerCase().includes(query)
    );
  }

  filterDists(event: any, index: number) {
    const query = event.query.toLowerCase();
    this.filteredDists = this.dists.filter(dist =>
      dist.distName.toLowerCase().includes(query)
    );
  }

  onCountrySelect(event: any, index: number) {
    if (event?.value?.countryId) {
      this.getStates(event.value.countryId).pipe(
        tap(states => {
          this.states = states;
          this.filteredStates = states;
          this.dists = [];
          this.filteredDists = [];
        })
      ).subscribe(() => {
        const addressGroup = this.branchesArray.at(index).get('address') as FormGroup;
        addressGroup.patchValue({
          state: null,
          dist: null
        });
      });
    }
  }

  onStateSelect(event: any, index: number) {
    if (event?.value?.stateId) {
      this.getDists(event.value.stateId).pipe(
        tap(dists => {
          this.dists = dists;
          this.filteredDists = dists;
        })
      ).subscribe(() => {
        const addressGroup = this.branchesArray.at(index).get('address') as FormGroup;
        addressGroup.patchValue({
          dist: null
        });
      });
    }
  }

  private resetComponent() {
    this.branchForm.reset();
    this.branchesArray.clear();
    this.addbranch = [];
    this.updatebranch = [];
    this.addBranch();
  }
  public BackToList() {

  }
  //#endregion

  //#region Server Side Operation
  private getCountries(): Observable<CountryDto[]> {
    return this.commonSvcs.getCountries().pipe(
      takeUntil(this.destroy$),
      map(response => response.data as CountryDto[]),
      catchError(() => {
        this.countries = [];
        return of(this.countries);
      })
    );
  }

  private getStates(countryId: any): Observable<StateDto[]> {
    return this.commonSvcs.getStates(countryId).pipe(
      takeUntil(this.destroy$),
      map(response => response.data as StateDto[]),
      catchError(() => {
        this.states = [];
        return of(this.states);
      })
    );
  }

  private getDists(stateId: any): Observable<DistDto[]> {
    return this.commonSvcs.getDists(stateId).pipe(
      takeUntil(this.destroy$),
      map(response => response.data as DistDto[]),
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

    if (this.branchForm.dirty && this.branchForm.touched) {
      this.isLoading = true;
      const operation$ = this.operationType === 'edit' ? this.branchSvcs.bulkUpdate(this.updatebranch) : this.branchSvcs.bulkCreate(this.addbranch);
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