import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { BranchDto, BranchModel, BranchUpdateModel } from 'src/app/api/entity/branch';
import { CountryDto } from 'src/app/api/entity/country';
import { DistDto } from 'src/app/api/entity/dist';
import { StateDto } from 'src/app/api/entity/state';
import { BranchService } from 'src/app/api/service/devloper/branch/branch.service';
import { LayoutService } from '../../shared/service/app.layout.service';
import { AuthenticationService } from 'src/app/api/service/account/authentication/authentication.service';
import { CommonService } from 'src/app/api/service/common/common.service';
import { BranchMessageService } from 'src/app/api/service/devloper/branch/branch-message.service';

@Component({
  selector: 'add-update-branch',
  templateUrl: './add-update-branch.component.html',
})
export class AddUpdateBranchComponent implements OnInit, OnDestroy {

  //#region Property Declaration
  public display = false;
  public isLoading = false;
  public operationType = '';
  private readonly destroy$ = new Subject<void>();
  private branchDataSub: Subscription = new Subscription();
  private operationTypeSub: Subscription = new Subscription();
  private branch: BranchDto = new BranchDto();
  private addbranch: BranchModel = new BranchModel();
  private updatebranch: BranchUpdateModel = new BranchUpdateModel();
  private countries: CountryDto[] = [];
  private states: StateDto[] = [];
  private dists: DistDto[] = [];
  public filteredCountries: CountryDto[] = [];
  public filteredStates: StateDto[] = [];
  public filteredDists: DistDto[] = [];
  public branchForm: FormGroup = this.initializeBranchForm();
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
    private messageService: BranchMessageService) {
  }
  //#endregion

  //#region Lifecycle Hooks
  ngOnInit() {
    this.getCountries().then(() => {
      this.branchDataSub = this.branchSvcs.getBranch().subscribe((operation) => {
        if (operation?.branch != null) {
          this.updatebranch = operation.branch;
          this.getStates(operation.branch.address.fk_CountryId).then(() => {
            const selectedState = this.states.find(s => s.stateId === operation.branch?.address.fk_StateId);
            if (selectedState) {
              this.getDists(selectedState.stateId).then(() => {
                const selectedDist = this.dists.find(d => d.distId === operation.branch?.address.fk_DistId);
                this.branchForm.patchValue({
                  branchCode: operation.branch?.branchCode,
                  branchName: operation.branch?.branchName,
                  contactNumber: operation.branch?.contactNumber,
                  address: {
                    country: this.countries.find(c => c.countryId === operation.branch?.address.fk_CountryId),
                    state: selectedState,
                    dist: selectedDist,
                    at: operation.branch?.address.at,
                    post: operation.branch?.address.post,
                    city: operation.branch?.address.city,
                    pinCode: operation.branch?.address.pinCode
                  }
                });
              })
            }
          })
        }
      });
    })
    this.operationTypeSub = this.branchSvcs.getOperationType().subscribe((data) => {
      this.operationType = data;
      if (this.operationType === 'edit') {
        this.branchForm.valueChanges.subscribe((values) => {
          this.updatebranch = {
            branchId: this.updatebranch.branchId,
            branchName: values.branchName,
            contactNumber: values.contactNumber,
            branchCode: values.branchCode,
            address: {
              addressId: this.updatebranch.address?.addressId,
              fk_CountryId: values.address.country?.countryId,
              fk_StateId: values.address.state?.stateId,
              fk_DistId: values.address.dist?.distId,
              at: values.address.at,
              post: values.address.post,
              city: values.address.city,
              pinCode: values.address.pinCode,
            }
          }
        });
      }
      else {
        this.branchForm.valueChanges.subscribe((values) => {
          this.addbranch = {
            branchName: values.branchName,
            contactNumber: values.contactNumber,
            branchCode: values.branchCode,
            address: {
              fk_CountryId: values.address.country?.countryId,
              fk_StateId: values.address.state?.stateId,
              fk_DistId: values.address.dist?.distId,
              at: values.address.at,
              post: values.address.post,
              city: values.address.city,
              pinCode: values.address.pinCode,
            }
          };
        });
      }
    });
  }
  ngOnDestroy() {
    this.operationTypeSub?.unsubscribe();
    this.branchDataSub?.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }
  //#endregion

  //#region Form Initialization
  private initializeBranchForm(): FormGroup {
    return this.fb.group({
      branchName: ['', [Validators.required, Validators.pattern(/^[A-Z\s]+$/)]],
      branchCode: ['', [Validators.required, Validators.pattern(/^[A-Z][A-Za-z0-9]*$/)]],
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
    })
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
    const addressGroup = this.branchForm.get('address');
    addressGroup?.patchValue({
      state: null,
      dist: null
    });
    this.states = [];
    this.dists = [];
    this.filteredStates = [];
    this.filteredDists = [];
    if (event.value.countryId) {
      this.getStates(event.value.countryId);
    }
  }
  onStateSelect(event: any) {
    const addressGroup = this.branchForm.get('address');
    addressGroup?.patchValue({
      dist: null
    });
    this.dists = [];
    this.filteredDists = [];
    if (event.value.stateId) {
      this.getDists(event.value.stateId);
    }
  }
  private resetComponent() {
    this.branchForm.reset();
    this.branch = new BranchDto();
    this.addbranch = new BranchModel();
    this.updatebranch = new BranchUpdateModel();
  }
  //#endregion

  //#region Server Side Operation
  private getCountries(): Promise<void> {
    return new Promise((resolve) => {
      this.commonSvcs.getCountries().subscribe({
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
      this.commonSvcs.getStates(countryId).subscribe({
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
      this.commonSvcs.getDists(stateId).subscribe({
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
  public submit(): void {
    if (this.branchForm.invalid) {
      this.branchForm.markAllAsTouched();
      return;
    }
    else{
      if (this.branchForm.dirty && this.branchForm.touched) {
        this.isLoading = true;
        if (this.operationType === 'edit') {
          this.branchSvcs.update(this.updatebranch).subscribe({
            next: async (response) => {
              if (response.responseCode == 200) {
                this.messageService.success(response.message);
                this.resetComponent();
              }
              this.isLoading = false;
            },
            error: (err) => {
              this.isLoading = false;
            }
          })
        } else {
          this.branchSvcs.create(this.addbranch).subscribe({
            next: async (response) => {
              if (response.responseCode === 201) {
                this.messageService.success(response.message);
                this.resetComponent();
              }
              this.isLoading = false;
            },
            error: (err) => {
              this.isLoading = false;
            }
          })
        }
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
  get branchJson(): string {
    return JSON.stringify(this.branch, null, 2);
  }
  get branchModelJson(): string {
    return JSON.stringify(this.addbranch, null, 2);
  }
  get BranchUpdatemodelJson(): string {
    return JSON.stringify(this.updatebranch, null, 2);
  }
  get formErrors(): string {
    return JSON.stringify(this.branchForm.errors, null, 2);
  }
  //#endregion
}
