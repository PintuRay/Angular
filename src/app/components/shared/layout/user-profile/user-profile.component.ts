import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LayoutService } from '../../service/app.layout.service';
import { CommonService } from 'src/app/api/service/common/common.service';
import { AuthorizationService } from 'src/app/api/service/account/authorization/authorization.service';
import { CountryDto } from 'src/app/api/entity/country';
import { StateDto } from 'src/app/api/entity/state';
import { DistDto } from 'src/app/api/entity/dist';
import { AuthenticationService } from 'src/app/api/service/account/authentication/authentication.service';
import { UserDto, UserMapper, UserUpdateModel } from 'src/app/api/entity/user-model';
import { GenericMessageService } from 'src/app/api/service/generic-message.Service';
import { catchError, finalize, map, Observable, of, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { CanComponentDeactivate } from 'src/app/utility/guards/deactivate.guard';
import { ConfirmationService } from 'primeng/api';
@Component({
  selector: 'user-profile',
  templateUrl: './user-profile.component.html',
  styles: `
    .loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}  `
})
export class UserProfileComponent implements CanComponentDeactivate {

  //#region Property Declaration
  display: boolean = false;
  public loading: boolean = false;
  userForm: FormGroup;
  private readonly destroy$ = new Subject<void>();
  formData: FormData = new FormData();
  isLoading = false;
  private user: UserDto = new UserDto();
  private updateUser: UserUpdateModel = new UserUpdateModel();
  filteredCountries: CountryDto[] = [];
  filteredStates: StateDto[] = [];
  filteredDists: DistDto[] = [];
  countries: CountryDto[] = [];
  states: StateDto[] = [];
  dists: DistDto[] = [];
  readonly marriedStatus = [
    { key: 'married', value: 'Married' },
    { key: 'unmarred', value: 'UnMarried' },
  ];
  filteredMaritalStatus: any[] = [];
  readonly gender = [
    { key: 'male', value: 'Male' },
    { key: 'female', value: 'Female' },
    { key: 'other', value: 'other' },
  ];
  filteredGender: any[] = [];
  profileUrl: string = '';
  selectedProfilePhoto: File | null = null;
  //#endregion

  //#region constructor
  constructor(
    private fb: FormBuilder,
    public layoutSvcs: LayoutService,
    private authorizeSvcs: AuthorizationService,
    private authSvcs: AuthenticationService,
    private commonSvcs: CommonService,
    private messageService: GenericMessageService,
    private confirmationService: ConfirmationService) {
    this.userForm = this.initializeUserForm();
  }
  //#endregion

  //#region Themme
  get dark(): boolean {
    return this.layoutSvcs.config().colorScheme !== 'light';
  }
  //#endregion

  //#region Lifecycle Hooks
  ngOnInit(): void {
    const Id = this.authSvcs.getUserDetails().id;
    this.getUserById(Id);
  }
  ngOnDestroy() {
    if (this.profileUrl) {
      URL.revokeObjectURL(this.profileUrl);
    }
    this.destroy$.next();
    this.destroy$.complete();
  }
  //#endregion

  //#region Guard
  canDeactivate(): Observable<boolean> {
    if (this.userForm.dirty) {
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
  private initializeUserForm(user?: UserUpdateModel) {
    return this.fb.group({
      id: [user?.id || ''],
      name: [user?.name || '', [Validators.required, Validators.minLength(5), Validators.pattern(/^[A-Za-z\s]+$/)]],
      birthDate: [user?.birthDate ? new Date(user.birthDate) : null, Validators.required],
      maratialStatus: [user?.maratialStatus ? this.marriedStatus.find(s => s.key === user.maratialStatus) : '', Validators.required],
      gender: [user?.gender ? this.gender.find(g => g.key === user.gender) : '', Validators.required],
      email: [user?.email || '', [Validators.required, Validators.email, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      phoneNumber: [user?.phoneNumber || '', [Validators.required, Validators.maxLength(10), Validators.pattern(/^[0-9]{10}$/)]],
      profilePhoto: [user?.profilePhoto || null],
      address: this.fb.group({
        country: [user?.address?.fk_CountryId && this.countries?.length ? this.countries.find(c => c.countryId === user.address.fk_CountryId) : null, Validators.required],
        state: [user?.address?.fk_StateId && this.states?.length ? this.states.find(s => s.stateId === user.address.fk_StateId) : null, Validators.required],
        dist: [user?.address?.fk_DistId && this.dists?.length ? this.dists.find(d => d.distId === user.address.fk_DistId) : null, Validators.required],
        at: [user?.address?.at || '', Validators.required],
        post: [user?.address?.post || '', Validators.required],
        city: [user?.address?.city || '', Validators.required],
        pinCode: [user?.address?.pinCode || '', [Validators.pattern(/^\d{6}$/)]]
      })
    });
  }
  //#endregion

  //#region Client Side Validation
  private getFieldLabel(controlName: string): string {
    const labels: { [key: string]: string } = {
      name: 'Name',
      birthDate: 'Birth Date',
      maratialStatus: 'Marital Status',
      gender: 'Gender',
      email: 'Email',
      phoneNumber: 'Phone Number',
      profilePhoto: 'Profile Photo',
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

  private getFormControl(controlName: string, groupName?: string): AbstractControl | null {
    if (groupName) {
      return this.userForm.get([groupName, controlName]);
    }
    else {
      return this.userForm.get(controlName);
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
    if (controlName === 'phoneNumber' && control.hasError('pattern')) {
      return `Please enter a valid 10-digit ${this.getFieldLabel(controlName)}`;
    }
    if (controlName === 'email' && control.hasError('email')) {
      return `Please enter a valid ${this.getFieldLabel(controlName)}`;
    }
    if (controlName === 'pinCode' && control.hasError('pattern')) {
      return `Please enter a valid 6-digit ${this.getFieldLabel(controlName)}`;
    }
    if (controlName === 'name' && control.hasError('minlength')) {
      return `${this.getFieldLabel(controlName)} must be at least 2 characters long.`;
    }
    return '';
  }
  //#endregion

  //#region Client Side Operation
  onProfilePhotoSelect(event: any) {
    if (event.files && event.files.length > 0) {
      const file = event.files[0];
      this.profileUrl = URL.createObjectURL(file);
      this.selectedProfilePhoto = file;
      this.userForm.get('profilePhoto')?.setValue(file);
      this.userForm.get('profilePhoto')?.markAsDirty();
      this.userForm.get('profilePhoto')?.markAsTouched();
    }
  }
  onProfilePhotoRemove() {
    if (this.updateUser.profilePhoto) {
      this.profileUrl = URL.createObjectURL(this.updateUser.profilePhoto);
    }
    this.selectedProfilePhoto = null;
    this.userForm.get('profilePhoto')?.setValue(null);
    this.userForm.get('profilePhoto')?.markAsDirty();
    this.userForm.get('profilePhoto')?.markAsTouched();
  }
  public filterMaritalStatus(event: any) {
    const query = event.query.toLowerCase();
    this.filteredMaritalStatus = this.marriedStatus.filter(status =>
      status.value.toLowerCase().includes(query)
    );
  }
  public filterGender(event: any) {
    const query = event.query.toLowerCase();
    this.filteredGender = this.gender.filter(status =>
      status.value.toLowerCase().includes(query)
    );
  }
  public filterCountries(event: any) {
    const query = event.query.toLowerCase();
    this.filteredCountries = this.countries.filter(country =>
      country.countryName.toLowerCase().includes(query)
    );
  }
  public filterStates(event: any) {
    const query = event.query.toLowerCase();
    this.filteredStates = this.states.filter(state =>
      state.stateName.toLowerCase().includes(query)
    );
  }
  public filterDists(event: any) {
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
        this.userForm.patchValue({
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
        this.userForm.patchValue({
          address: {
            dist: null
          }
        });
      });
    }
  }
  private convertFormToFormData(formValue: any): FormData {
    this.formData = new FormData();
    this.formData.append('Id', formValue.id);
    this.formData.append('Name', formValue.name);
    this.formData.append('BirthDate', new Date(formValue.birthDate).toISOString());
    this.formData.append('MaratialStatus', formValue.maratialStatus.key);
    this.formData.append('Gender', formValue.gender.key);
    this.formData.append('Email', formValue.email);
    this.formData.append('PhoneNumber', formValue.phoneNumber);
    this.formData.append('PhotoPath', this.updateUser.photoPath);
    if (this.selectedProfilePhoto instanceof File) {
      this.formData.append('ProfilePhoto', this.selectedProfilePhoto, this.selectedProfilePhoto.name);
    } else {
      this.formData.append('ProfilePhoto', '');
    }
    this.formData.append('fk_AdressId', this.updateUser.fk_AdressId);
    this.formData.append('PhotoPath', this.updateUser.photoPath);
    this.formData.append('Address.AddressId', this.updateUser.address.addressId);
    this.formData.append('Address.Fk_CountryId', formValue.address.country?.countryId);
    this.formData.append('Address.Fk_StateId', formValue.address.state?.stateId);
    this.formData.append('Address.Fk_DistId', formValue.address.dist?.distId);
    this.formData.append('Address.At', formValue.address.at);
    this.formData.append('Address.Post', formValue.address.post);
    this.formData.append('Address.City', formValue.address.city);
    this.formData.append('Address.PinCode', formValue.address.pinCode);
    return this.formData;
  }
  private initializeFilters() {
    this.filteredCountries = this.countries;
    this.filteredStates = this.states;
    this.filteredDists = this.dists;
    this.filteredMaritalStatus = this.marriedStatus;
    this.filteredGender = this.gender;
  }
  //#endregion

  //#region Server Side Operations
  private getUserById(Id: string) {
    this.loading = true;
    this.authorizeSvcs.getUserById(Id).pipe(
      switchMap((response) => {
        if (response.responseCode === 200) {
          this.user = response.data as UserDto;
          return this.getCountries();
        } else {
          return of([]);
        }
      }),
      switchMap((countries) => {
        this.countries = countries;
        if (this.user.address?.fk_CountryId) {
          return this.getStates(this.user.address.fk_CountryId);
        }
        return of([]);
      }),
      switchMap((states) => {
        this.states = states;
        if (this.user.address?.fk_StateId) {
          return this.getDists(this.user.address.fk_StateId);
        }
        return of([]);
      }),
      finalize(() => {
        this.loading = false;
      })
    ).subscribe({
      next: (dists) => {
        this.dists = dists;
        this.loadProfileImage();
        this.updateUser = UserMapper.dtoToUpdateModel(this.user);
        this.userForm = this.initializeUserForm(this.updateUser);
        this.initializeFilters();
      },
      error: (error) => {
        this.loading = false;
      }
    });
  }
  private loadProfileImage() {
    if (this.user.photoPath) {
      this.authorizeSvcs.GetImage(this.user.photoPath).subscribe({
        next: (profilePhoto) => {
          this.profileUrl = URL.createObjectURL(profilePhoto);
          this.updateUser.profilePhoto = profilePhoto;
        },
        error: (error) => {
          console.error('Error loading profile image:', error);
        }
      });
    }
  }
  private getCountries(): Observable<CountryDto[]> {
    return this.commonSvcs.getCountries().pipe(
      takeUntil(this.destroy$),
      // tap(response => console.log('API Response:', response)),
      map(response => response.data as CountryDto[]),
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
      //tap(response => console.log('API Response:', response)),
      map((response) => response.data as DistDto[]),
      catchError(() => {
        this.dists = [];
        return of(this.dists);
      })
    );
  }
  public onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }
    else {
      if (this.userForm.dirty && this.userForm.touched) {
        this.isLoading = true;
        const formData = this.convertFormToFormData(this.userForm.value);
        this.authorizeSvcs.updateUser(formData).subscribe({
          next: (response) => {
            if (response.responseCode === 200) {
              this.messageService.success(response.message);
              this.isLoading = false;
              this.userForm.markAsPristine();  
              this.userForm.markAsUntouched(); 
            }
          },
          error: (error) => {
            this.isLoading = false;
          },
        });
      } else {
        this.messageService.warning('No Change Detected');
      }
    }
  }
  //#endregion

  //#region Test form
  get formJson(): string {
    return JSON.stringify(this.userForm.value, null, 2);
  }
  get formDataJson(): string {
    const formDataObj: { [key: string]: any } = {};
    try {
      this.formData?.forEach((value, key) => {
        // Handle File objects specially
        if (value instanceof File) {
          formDataObj[key] = {
            fileName: value.name,
            type: value.type,
            size: `${(value.size / 1024).toFixed(2)} KB`
          };
        } else {
          formDataObj[key] = value;
        }
      });

      return JSON.stringify(formDataObj, null, 2);
    } catch (error) {
      return 'No form data available';
    }
  }
  get userDtoJson(): string {
    return JSON.stringify(this.user, null, 2);
  }
  get userUpdateModelJson(): string {
    return JSON.stringify(this.updateUser, null, 2);
  }
  //#endregion
}
