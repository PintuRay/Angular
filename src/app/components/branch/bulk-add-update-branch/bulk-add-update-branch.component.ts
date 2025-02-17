import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { filter, Subject, Subscription, takeUntil } from 'rxjs';
import { BranchService } from 'src/app/api/service/devloper/branch/branch.service';
import { LayoutService } from '../../shared/service/app.layout.service';
import { BranchDto, BranchModel, BranchUpdateModel } from 'src/app/api/entity/branch';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/api/service/common/common.service';
import { CountryDto } from 'src/app/api/entity/country';
import { StateDto } from 'src/app/api/entity/state';
import { DistDto } from 'src/app/api/entity/dist';
import { BranchMessageService } from 'src/app/api/service/devloper/branch/branch-message.service';

@Component({
  selector: 'app-bulk-add-update-branch',
  templateUrl: './bulk-add-update-branch.component.html',
})
export class BulkAddUpdateBranchComponent {
  public display: boolean = false;
  public operationType: string = '';
  private readonly destroy$ = new Subject<void>();
  private operationTypeSub!: Subscription;
  private branchDataSub!: Subscription;
  public branch: BranchDto[] = [];
  private addbranch: BranchModel[] = [];
  private updatebranch: BranchUpdateModel[] = [];
  public branchForm: FormGroup = this.initializeBranchForm();
  public isLoading: boolean = false;
  public countries: CountryDto[] = [];
  public states: StateDto[] = [];
  public dists: DistDto[] = [];
  public filteredCountries: CountryDto[][] = [];
  public filteredStates: StateDto[][] = [];
  public filteredDists: DistDto[][] = [];

  constructor(
    private fb: FormBuilder,
    private branchSvcs: BranchService,
    public layoutSvcs: LayoutService,
    private router: Router,
    private messageService: BranchMessageService,
    private commonSvcs: CommonService,
  ) { }

  async ngOnInit() {
    await this.getCountries();
    this.branchDataSub = this.branchSvcs.getBulkBranch().subscribe((operation) => {
      if (operation?.branches && operation.branches.length > 0) {
        this.branches.clear(); // Clear existing branches
        this.updatebranch = operation.branches;
        operation.branches.forEach(branch => {
          const branchGroup = this.createBranchFormGroup();
          this.getStates(branch.address.fk_CountryId).then(() => {
            const selectedState = this.states.find(s => s.stateId === branch.address.fk_StateId);
            if (selectedState) {
              this.getDists(selectedState.stateId).then(() => {
                const selectedDist = this.dists.find(d => d.distId === branch.address.fk_DistId);
                branchGroup.patchValue({
                  branchCode: branch.branchCode,
                  branchName: branch.branchName,
                  contactNumber: branch.contactNumber,
                  address: {
                    country: this.countries.find(c => c.countryId === branch.address.fk_CountryId),
                    state: selectedState,
                    dist: selectedDist,
                    at: branch.address.at,
                    post: branch.address.post,
                    city: branch.address.city,
                    pinCode: branch.address.pinCode,
                  }
                });
                this.branches.push(branchGroup);
              });
            }
          });
        });
      }
    });

    this.operationTypeSub = this.branchSvcs.getBulkOperationType().pipe(filter(type => !!type)).subscribe((data) => {
      this.operationType = data;
      this.branchForm.valueChanges.subscribe((values) => {
        if (this.operationType === 'add') {
          this.addbranch = values.branches.map((branch: any) => {
            return {
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
            };
          });
        } else if (this.operationType === 'edit') {
          this.updatebranch = values.branches.map((branch: any, index: number) => {
            const existingBranch = this.updatebranch[index];
            return {
              branchId: existingBranch.branchId,
              branchName: branch.branchName,
              contactNumber: branch.contactNumber,
              branchCode: branch.branchCode,
              address: {
                addressId: existingBranch.address.addressId,
                fk_CountryId: branch.address.country?.countryId,
                fk_StateId: branch.address.state?.stateId,
                fk_DistId: branch.address.dist?.distId,
                at: branch.address.at,
                post: branch.address.post,
                city: branch.address.city,
                pinCode: branch.address.pinCode,
              }
            };
          });
        }
      });
    });
  }

  ngOnDestroy() {
    this.operationTypeSub?.unsubscribe();
    this.branchDataSub?.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeBranchForm(): FormGroup {
    return this.fb.group({
      branches: this.fb.array([])
    });
  }

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

  public getFormControl(index: number, controlName: string, groupName?: string) {
    return groupName
      ? this.branches.at(index).get([groupName, controlName])
      : this.branches.at(index).get(controlName);
  }

  isFieldInvalid(index: number, controlName: string, groupName?: string): boolean {
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
      return `${this.getFieldLabel(controlName)} should start with uppercase letters followed by a combination of letters and numbers.`;
    }
    return '';
  }

  get branches() {
    return this.branchForm.get('branches') as FormArray;
  }

  createBranchFormGroup(): FormGroup {
    return this.fb.group({
      branchCode: ['', [Validators.required, Validators.pattern(/^[A-Z][A-Za-z0-9]*$/)]],
      branchName: ['', [Validators.required, Validators.pattern(/^[A-Z\s]+$/)]],
      contactNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      address: this.fb.group({
        country: ['', Validators.required],
        state: ['', Validators.required],
        dist: ['', Validators.required],
        at: ['', Validators.required],
        post: ['', Validators.required],
        city: ['', Validators.required],
        pinCode: ['', [Validators.pattern(/^\d{6}$/)]]
      })
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
    this.resetComponent();
    this.router.navigate(['branch/list-branch']);
  }

  filterCountries(event: any, index: number) {
    const query = event.query.toLowerCase();
    this.filteredCountries[index] = this.countries.filter(country =>
      country.countryName.toLowerCase().includes(query)
    );
  }

  filterStates(event: any, index: number) {
    const query = event.query.toLowerCase();
    // Filter the states directly from the single array
    this.filteredStates[index] = this.states.filter(state =>
      state.stateName.toLowerCase().includes(query)
    );
  }

  filterDists(event: any, index: number) {
    const query = event.query.toLowerCase();
    this.filteredDists[index] = this.dists.filter(dist =>
      dist.distName.toLowerCase().includes(query)
    );
  }

  onCountrySelect(event: any, index: number) {
    const addressGroup = this.branches.at(index).get('address') as FormGroup;
    addressGroup.patchValue({
      state: null,
      dist: null
    });
    this.filteredStates[index] = [];
    this.filteredDists[index] = [];
    if (event.value.countryId) {
      this.getStates(event.value.countryId).then(() => {
        this.filteredStates[index] = this.states;
      });
    }
  }

  onStateSelect(event: any, index: number) {
    const addressGroup = this.branches.at(index).get('address') as FormGroup;
    addressGroup.patchValue({
      dist: null
    });
    this.filteredDists[index] = [];
    if (event.value.stateId) {
      this.getDists(event.value.stateId).then(() => {
        this.filteredDists[index] = this.dists;
      });
    }
  }

  private resetComponent() {
    this.branchForm.reset();
    this.branch = [];
    this.addbranch = [];
    this.updatebranch = [];
  }

  private getCountries(): Promise<void> {
    return new Promise((resolve) => {
      this.commonSvcs.getCountries().pipe(takeUntil(this.destroy$)).subscribe({
        next: (response) => {
          if (response.responseCode === 200) {
            this.countries = response.data.records as CountryDto[];
          }
          resolve();
        },
        error: () => resolve()
      });
    });
  }

  private getStates(countryId: any): Promise<void> {
    return new Promise((resolve) => {
      this.commonSvcs.getStates(countryId).pipe(takeUntil(this.destroy$)).subscribe({
        next: (response) => {
          if (response.responseCode === 200) {
            this.states = response.data.records as StateDto[];
          }
          resolve();
        },
        error: () => resolve()
      });
    });
  }

  private getDists(stateId: any): Promise<void> {
    return new Promise((resolve) => {
      this.commonSvcs.getDists(stateId).pipe(takeUntil(this.destroy$)).subscribe({
        next: (response) => {
          if (response.responseCode === 200) {
            this.dists = response.data.records as DistDto[];
          }
          resolve();
        },
        error: () => resolve()
      });
    });
  }

  public submit() {
    if (this.branchForm.invalid) {
      this.branchForm.markAllAsTouched();
      return;
    } else {
      if (this.branchForm.dirty && this.branchForm.touched) {
        this.isLoading = true;
        if (this.operationType === 'add') {
          this.branchSvcs.bulkCreate(this.addbranch).pipe(takeUntil(this.destroy$)).subscribe({
            next: (response) => {
              if (response.responseCode === 201) {
                this.messageService.success(response.message);
                this.resetComponent();
                this.addBranch();
              }
              this.isLoading = false;
            },
            error: (err) => {
              this.isLoading = false;
            }
          });
        } else {
          this.branchSvcs.bulkUpdate(this.updatebranch).pipe(takeUntil(this.destroy$)).subscribe({
            next: (response) => {
              if (response.responseCode === 200) {
                this.messageService.success(response.message);
                this.resetComponent();
                this.addBranch();
              }
              this.isLoading = false;
            },
            error: (err) => {
              this.isLoading = false;
            }
          });
        }
      } else {
        this.messageService.warning('No Change Detected');
      }
    }
  }

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
  get BranchUpdateModelJson(): string {
    return JSON.stringify(this.updatebranch, null, 2);
  }
  //#endregion

  private mapToBranchModel(branch: any): BranchModel {
    return {
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
    };
  }
}