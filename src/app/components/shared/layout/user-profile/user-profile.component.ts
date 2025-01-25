import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LayoutService } from '../../service/app.layout.service';
import { CommonService } from 'src/app/api/service/common/common.services';
import { MessageService } from 'primeng/api';
import { AuthorizationService } from 'src/app/api/service/account/authorization/authorization.service';
import { Country } from 'src/app/api/entity/country';
import { State } from 'src/app/api/entity/state';
import { Dist } from 'src/app/api/entity/dist';
import { AuthenticationService } from 'src/app/api/service/account/authentication/authentication.service';
import { UserModel } from 'src/app/api/model/account/authentication/user-model';
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
  user: UserModel = new UserModel();
  countries: Country[] = [];
  filteredCountries: Country[] = [];
  states: State[] = [];
  filteredStates: State[] = [];
  dists: Dist[] = [];
  filteredDists: Dist[] = [];
  marriedStatus = [
    { key: 'married', value: 'Married' },
    { key: 'unmarred', value: 'UnMarried' },
  ];
  filteredMaritalStatus: any[] = [];
  gender = [
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
  private initializeUserForm(user?: UserModel): void {
    this.userForm = this.fb.group({
      id: [user?.id || ''],
      name: [user?.name || '', [Validators.required, Validators.minLength(2)]],
      birthDate: [user?.birthDate ? new Date(user.birthDate) : null, Validators.required],
      maratialStatus: [user?.maratialStatus ? this.marriedStatus.find(s => s.key === user.maratialStatus) : '', Validators.required],
      gender: [user?.gender ? this.gender.find(g => g.key === user.gender) : '', Validators.required],
      email: [user?.email || '', [Validators.required, Validators.email]],
      phoneNumber: [user?.phoneNumber || '', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      profilePhoto: [user?.profilePhoto || null],
      address: this.fb.group({
        country: [user?.address?.fk_CountryId ? this.countries.find(c => c.countryId === user.address.fk_CountryId) : '', Validators.required],
        state: [user?.address?.fk_StateId ? this.states.find(s => s.stateId === user.address.fk_StateId) : '', Validators.required],
        dist: [user?.address?.fk_DistId ? this.dists.find(d => d.distId === user.address.fk_DistId) : '', Validators.required],
        at: [user?.address?.at || ''],
        post: [user?.address?.post || ''],
        city: [user?.address?.city || ''],
        pinCode: [user?.address?.pinCode || '', [Validators.pattern(/^[0-9]{6}$/)]]
      })
    });
  }
  onProfilePhotoSelect(event: any) {
    if (event.files && event.files.length > 0) {
      const file = event.files[0];
      this.profileUrl = URL.createObjectURL(file);
      this.selectedProfilePhoto = file;
      this.userForm.get('profilePhoto')?.setValue(file);
    }
  }
  onProfilePhotoRemove() {
    if (this.user.profilePhoto) {
      this.profileUrl = URL.createObjectURL(this.user.profilePhoto);
    }
    this.selectedProfilePhoto = null;
    this.userForm.get('profilePhoto')?.setValue(null);
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
    this.formData.append('MaratialStatus', formValue.maratialStatus.key );
    this.formData.append('Gender', formValue.gender.key);
    this.formData.append('Email', formValue.email);
    this.formData.append('PhoneNumber', formValue.phoneNumber);
    this.formData.append('PhotoPath', this.user.photoPath);
    if (this.selectedProfilePhoto instanceof File) {
      this.formData.append('ProfilePhoto', this.selectedProfilePhoto, this.selectedProfilePhoto.name);
    } else {
      this.formData.append('ProfilePhoto', '');
    }
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
          this.user = response.data.singleObjData as UserModel;
          this.authorizeSvcs.GetImage(this.user.photoPath).subscribe(profilePhoto => {
            this.profileUrl = URL.createObjectURL(profilePhoto),
              this.user.profilePhoto = profilePhoto;
          });
          await this.getCountries();
          await this.getStates(this.user.address?.fk_CountryId);
          await this.getDists(this.user.address?.fk_StateId);
          this.initializeUserForm(this.user);
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
            this.countries = response.data.collectionObjData as Country[];
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
            this.states = response.data.collectionObjData as State[];
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
            this.dists = response.data.collectionObjData as Dist[];
          }
          resolve();
        },
        error: () => resolve()
      });
    });
  }
  public onSubmit(): void {
    try {
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
    }
    catch (error) {
			this.isLoading = false;
			this.messageService.add({
				severity: 'error',
				summary: 'Error',
				detail: 'Some Error Occoured'
			});
    }
  }
  //#endregion

  //#region Test form
  get formJson(): string {
    return JSON.stringify(this.userForm.value, null, 2);
  }
  get userModelJson(): string {
    return JSON.stringify(this.user, null, 2);
  }
  get countryModelJson(): string {
    return JSON.stringify(this.countries, null, 2);
  }
  get stateModelJson(): string {
    return JSON.stringify(this.states, null, 2);
  }
  get DistModelJson(): string {
    return JSON.stringify(this.dists, null, 2);
  }
  //#endregion
}
