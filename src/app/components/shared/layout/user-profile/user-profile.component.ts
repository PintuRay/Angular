import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LayoutService } from '../../service/app.layout.service';
import { CommonService } from 'src/app/api/service/common/common.service';
import { MessageService } from 'primeng/api';
import { AuthorizationService } from 'src/app/api/service/account/authorization/authorization.service';
import { CountryDto } from 'src/app/api/entity/country';
import { StateDto } from 'src/app/api/entity/state';
import { DistDto } from 'src/app/api/entity/dist';
import { AuthenticationService } from 'src/app/api/service/account/authentication/authentication.service';
import { UserDto, UserMapper, UserUpdateModel } from 'src/app/api/entity/user-model';
import { AddressUpdateModel } from 'src/app/api/entity/address';
@Component({
  selector: 'user-profile',
  templateUrl: './user-profile.component.html',
})
export class UserProfileComponent {

  //#region Property Declaration
  display: boolean = false;
  userForm!: FormGroup;
  formData: FormData = new FormData();
  isLoading = false;
  private user: UserDto = new UserDto();
  private updateUser: UserUpdateModel = new UserUpdateModel();
  private countries: CountryDto[] = [];
  private states: StateDto[] = [];
  private dists: DistDto[] = [];
  filteredCountries: CountryDto[] = [];
  filteredStates: StateDto[] = [];
  filteredDists: DistDto[] = [];
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
    private messageService: MessageService) {

  }
  //#endregion

  //#region Themme
  get dark(): boolean {
    return this.layoutSvcs.config().colorScheme !== 'light';
  }
  //#endregion

  //#region Lifecycle Hooks
  ngOnInit(): void {
    this.initializeUserForm();
    const Id = this.authSvcs.getUserDetails().id;
    this.getUserById(Id);
  }
  ngOnDestroy() {
    if (this.profileUrl) {
      URL.revokeObjectURL(this.profileUrl);
    }
  }
  //#endregion

  //#region Form Initialization
  private initializeUserForm(user?: UserUpdateModel): void {
    this.userForm = this.fb.group({
      id: [user?.id || ''],
      name: [user?.name || '', [Validators.required, Validators.minLength(5), Validators.pattern(/^[A-Za-z\s]+$/)]],
      birthDate: [user?.birthDate ? new Date(user.birthDate) : null, Validators.required],
      maratialStatus: [user?.maratialStatus ? this.marriedStatus.find(s => s.key === user.maratialStatus) : '', Validators.required],
      gender: [user?.gender ? this.gender.find(g => g.key === user.gender) : '', Validators.required],
      email: [user?.email || '', [Validators.required, Validators.email, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      phoneNumber: [user?.phoneNumber || '', [Validators.required, Validators.maxLength(10), Validators.pattern(/^[0-9]{10}$/)]],
      profilePhoto: [user?.profilePhoto || null],
      address: this.fb.group({
        country: [user?.address?.fk_CountryId ? this.countries.find(c => c.countryId === user.address.fk_CountryId) : '', Validators.required],
        state: [user?.address?.fk_StateId ? this.states.find(s => s.stateId === user.address.fk_StateId) : '', Validators.required],
        dist: [user?.address?.fk_DistId ? this.dists.find(d => d.distId === user.address.fk_DistId) : '', Validators.required],
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
      const profilePhotoControl = this.userForm.get('profilePhoto') as FormControl;
      if (profilePhotoControl) {
        profilePhotoControl.setValue(file);
        profilePhotoControl.markAsDirty();
        profilePhotoControl.markAsTouched();
      }
    }
  }
  onProfilePhotoRemove() {
    if (this.updateUser.profilePhoto) {
      this.profileUrl = URL.createObjectURL(this.updateUser.profilePhoto);
    }
    this.selectedProfilePhoto = null;
    const profilePhotoControl = this.userForm.get('profilePhoto') as FormControl;
    if (profilePhotoControl) {
      profilePhotoControl.setValue(null);
      profilePhotoControl.markAsDirty();
      profilePhotoControl.markAsTouched();
    }
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
    this.filteredStates = this.states.filter(status =>
      status.stateName.toLowerCase().includes(query)
    );
  }
  public filterDists(event: any) {
    const query = event.query.toLowerCase();
    this.filteredDists = this.dists.filter(status =>
      status.distName.toLowerCase().includes(query)
    );
  }
  public onCountrySelect(event: any) {
    this.states = [];
    this.dists = [];
    this.filteredStates = [];
    this.filteredDists = [];
    if (event.value.countryId) {
      this.getStates(event.value.countryId);
    }
  }
  public onStateSelect(event: any) {
    this.dists = [];
    this.filteredDists = [];
    if (event.value.stateId) {
      this.getDists(event.value.stateId);
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
  //#endregion

  //#region Server Side Operations
  private getUserById(Id: string) {
    this.authorizeSvcs.getUserById(Id).subscribe({
      next: async (response) => {
        if (response.responseCode === 200) {
          this.user = response.data.singleObjData as UserDto;
          await this.getCountries();
          await this.getStates(this.user.address?.fk_CountryId);
          await this.getDists(this.user.address?.fk_StateId);
          this.updateUser = UserMapper.dtoToUpdateModel(this.user);
          this.authorizeSvcs.GetImage(this.user.photoPath).subscribe(profilePhoto => {
            this.profileUrl = URL.createObjectURL(profilePhoto),
              this.updateUser.profilePhoto = profilePhoto;
          });
          this.initializeUserForm(this.updateUser);
          this.filteredMaritalStatus = this.marriedStatus.filter(status => status.key === this.user.maratialStatus);
          this.filteredGender = this.gender.filter(gender => gender.key === this.user.gender);
          this.filteredCountries = this.countries.filter(country => country.countryId === this.user.address?.fk_CountryId);
          this.filteredStates = this.states.filter(state => state.stateId === this.user.address?.fk_StateId);
          this.filteredDists = this.dists.filter(dist => dist.distId === this.user.address?.fk_DistId);
        }
      },
      error: (err) => {
        console.error('Error fetching user', err);
      }
    });
  }
  private getCountries(): Promise<void> {
    return new Promise((resolve) => {
      this.commonSvcs.getCountries().subscribe({
        next: (response) => {
          if (response.responseCode === 200) {
            this.countries = response.data.collectionObjData as CountryDto[];
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
            this.states = response.data.collectionObjData as StateDto[];
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
            this.dists = response.data.collectionObjData as DistDto[];
          }
          resolve();
        },
        error: () => resolve()
      });
    });
  }
  public onSubmit(): void {
    try {
      if (this.userForm.dirty && this.userForm.touched) {
        if (this.userForm.valid) {
          this.isLoading = true;
          const formData = this.convertFormToFormData(this.userForm.value);
          this.authorizeSvcs.updateUser(formData).subscribe({
            next: (response) => {
              if (response.responseCode === 200) {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Success',
                  detail: 'Record Updatated successful'
                });
              }
            },
            error: (error) => {
              this.isLoading = false;
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: error.error?.message || 'Some Error Occoured'
              });
            },
          });
        }
      } else {
        this.messageService.add({
          severity: 'warn',
          summary: 'warn',
          detail: 'No Change Detected'
        });
      }
    }
    catch (error) {
      this.isLoading = false;
      this.messageService.add({
        severity: 'warning',
        summary: 'warning',
        detail: 'Some Error Occoured'
      });
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
