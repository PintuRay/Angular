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
    this.getCountries();
    const Id = this.authSvcs.getUserDetails().id;
   this.GetUserById(Id);
  }
  //#endregion

  //#region Form Initialization
  private initializeUserForm(user?: UserModel): void {
    this.userForm = this.fb.group({
      id: [user?.id || ''],
      name: [user?.name || '', [Validators.required, Validators.minLength(2)]],
      birthDate: [user?.birthDate ? new Date(user.birthDate) : null, Validators.required],
      maratialStatus: [user?.maratialStatus ? this.marriedStatus.find(s => s.key === user.maratialStatus)?.value : '', Validators.required],
      gender: [user?.gender ? this.gender.find(g => g.key === user.gender)?.value : '', Validators.required],
      email: [user?.email || '', [Validators.required, Validators.email]],
      phoneNumber: [user?.phoneNumber || '', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
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

  //#region Client Side Operation
  private getMaritalStatusName(maratialStatus: string | undefined): string {
    const status = this.marriedStatus.find(s => s.key === maratialStatus);
    return status?.value || '';
  }
  private getGenderName(gender: string | undefined): string {
    const genderOption = this.gender.find(g => g.key === gender);
    return genderOption?.value || '';
  }
  private getCountryName(countryId: string | undefined): string {
    const country = this.countries.find(c => c.countryId === countryId);
    return country ? country.countryName : '';
  }
  private getStateName(stateId: string | undefined): string {
    const state = this.states.find(s => s.stateId === stateId);
    return state ? state.stateName : '';
  }
  private getDistName(distId: string | undefined): string {
    const dist = this.dists.find(d => d.distId === distId);
    return dist ? dist.distName : '';
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
  public onProfilePhotoSelect(event: any) {
    if (event.files && event.files.length > 0) {
      const file = event.files[0];
      this.selectedProfilePhoto = file;
      this.userForm.get('personalInfo.profilePhoto')?.setValue(file);
    }
  }
  public onProfilePhotoRemove() {
    this.selectedProfilePhoto = null;
    this.userForm.get('personalInfo.profilePhoto')?.setValue(null);
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
  //#endregion

  //#region Server Side Operations
  private GetUserById(Id: string) {
    this.authorizeSvcs.GetUserById(Id).subscribe({
      next: (response) => {
        if (response.responseCode === 200) {
          this.user = response.data.singleObjData as UserModel;
          this.filteredMaritalStatus = this.marriedStatus.filter(status => status.key === this.user.maratialStatus);
          this.filteredGender = this.gender.filter( gender => gender.key === this.user.gender);
          this.filteredCountries = this.countries.filter(country => country.countryId === this.user.address?.fk_CountryId);
          this.getStates(this.user.address?.fk_CountryId).then(() => {
            this.filteredStates = this.states.filter(
              state => state.stateId === this.user.address?.fk_StateId
            );
          });
          this.getDists(this.user.address?.fk_StateId).then(() => {
            this.filteredDists = this.dists.filter(
              dist => dist.distId === this.user.address?.fk_DistId
            );
          });
          this.initializeUserForm(this.user);
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
  public onSubmit() {

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