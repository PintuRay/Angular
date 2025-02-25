import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/api/service/account/authentication/authentication.service';
import { CommonService } from 'src/app/api/service/common/common.service';
import { LayoutService } from '../../../shared/service/app.layout.service';
import { environment } from 'src/app/utility/environment/environment';
import { MenuItem } from 'primeng/api';
import { CountryDto } from 'src/app/api/entity/country';
import { StateDto } from 'src/app/api/entity/state';
import { DistDto } from 'src/app/api/entity/dist';
import { catchError, map, Observable, of, Subject, takeUntil } from 'rxjs';
import { GenericMessageService } from 'src/app/api/service/generic-message.Service';

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit {

	//#region Property Declaration
	private readonly destroy$ = new Subject<void>();
	public registerForm: FormGroup = this.initializeRegisterForm();
	private formData: FormData = new FormData();
	readonly returnUrl: string = environment.EmailConfirmation;
	private countries: CountryDto[] = [];
	private states: StateDto[] = [];
	private dists: DistDto[] = [];
	private readonly marriedStatus = [
		{ key: 'married', value: 'Married' },
		{ key: 'unmarred', value: 'UnMarried' },
	];
	private readonly gender = [
		{ key: 'male', value: 'Male' },
		{ key: 'female', value: 'Female' },
		{ key: 'other', value: 'other' },
	];
	public filteredCountries: CountryDto[] = [];
	public filteredStates: StateDto[] = [];
	public filteredDists: DistDto[] = [];
	public filteredMaritalStatus: any[] = [];
	public filteredGender: any[] = [];
	public tokenValue: string = '';
	private tokenId: string = '';
	public isLoading = false;
	public emailLoading = false;
	public phoneNoLoading = false;
	public userNameLoading = false;
	public items: MenuItem[] = [];
	public activeIndex: number = 0;
	public isvalidMail = false;
	public isPhoneNumberValid = false;
	public isUserValid = false;
	private selectedProfilePhoto: File | null = null;
	public display: boolean = false;
	//#endregion 

	//#region constructor
	constructor(
		private fb: FormBuilder,
		public layoutSvcs: LayoutService,
		private authSvcs: AuthenticationService,
		private commonSvcs: CommonService,
		private messageService: GenericMessageService) { }
	//#endregion

	//#region Lifecycle Hooks
	ngOnInit(): void {
		this.initializeSteps();
		this.registerForm.disable();
	}
	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}
	//#endregion

	//#region Form Initialization
	private initializeRegisterForm() {
		return this.fb.group({
			// Account Information
			accountInfo: this.fb.group({
				email: ['', [Validators.required, Validators.email, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
				phoneNumber: ['', [Validators.required, Validators.maxLength(10), Validators.pattern(/^\d{10}$/)]],
				password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*!])[A-Za-z\d@#$%^&*!]{8,}$/)]],
				confirmPassword: ['', [Validators.required]]
			}),
			// Personal Information
			personalInfo: this.fb.group({
				name: ['', [Validators.required, Validators.minLength(5), Validators.pattern(/^[A-Za-z\s]+$/)]],
				birthDate: ['', [Validators.required]],
				profilePhoto: [null, [Validators.required]],
				maritalStatus: ['', [Validators.required]],
				gender: ['', [Validators.required]],
			}),
			// Address Information	
			address: this.fb.group({
				country: ['', [Validators.required]],
				state: ['', [Validators.required]],
				dist: ['', [Validators.required]],
				at: ['', [Validators.required]],
				post: ['', [Validators.required]],
				city: ['', [Validators.required]],
				pinCode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
			})
		});
	}
	//#endregion

	//#region MultiStep Form
	private initializeSteps() {
		this.items = [
			{
				label: 'Account',
				command: (event: any) => {
					this.activeIndex = 0;
				}
			},
			{
				label: 'Personal',
				command: (event: any) => {
					this.activeIndex = 1;
				}
			},
			{
				label: 'Address',
				command: (event: any) => {
					this.activeIndex = 2;
				}
			}
		];
	}
	nextStep() {
		if (this.activeIndex < 2) {
			this.activeIndex++;
		}
	}
	prevStep() {
		if (this.activeIndex > 0) {
			this.activeIndex--;
		}
	}
	isStepValid(step: number): boolean {
		const form = this.registerForm;
		if (!form) return false;
		switch (step) {
			case 0:
				return form.get('accountInfo')?.valid ?? false;
			case 1:
				return form.get('personalInfo')?.valid ?? false;
			case 2:
				return form.get('address')?.valid ?? false;
			default:
				return false;
		}
	}
	//#endregion

	//#region Client Side Vaildation
	private getFieldLabel(controlName: string): string {
		const labels: { [key: string]: string } = {
			email: 'Email',
			phoneNumber: 'Phone Number',
			password: 'Password',
			confirmPassword: 'Confirm Password',
			name: 'Name',
			birthDate: 'Birth Date',
			profilePhoto: 'Profile Photo',
			maritalStatus: 'Marital Status',
			gender: 'Gender',
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
	private getFormControl(groupName: string, controlName: string): AbstractControl | null {
		return this.registerForm.get([groupName, controlName]);
	}
	public isFieldInvalid(groupName: string, controlName: string): boolean {
		const control = this.getFormControl(groupName, controlName);
		return !!control && control.invalid && (control.dirty || control.touched);
	}
	public getErrorMessage(groupName: string, controlName: string): string {

		const control = this.getFormControl(groupName, controlName);
		if (!control) return '';
		if (control.hasError('required')) {
			return `${this.getFieldLabel(controlName)} is required.`;
		}
		if (controlName === 'email' && control.hasError('pattern')) {
			return `${this.getFieldLabel(controlName)} should be in bellow Format e.g John@example.com.`;
		}
		if (controlName === 'phoneNumber' && control.hasError('pattern')) {
			return `${this.getFieldLabel(controlName)} must be 10  digit.`;
		}
		if (controlName === 'password') {
			if (control.hasError('minlength')) {
				return `${this.getFieldLabel(controlName)} must be at least 8 characters long.`;
			}
			if (control.hasError('pattern')) {
				return `${this.getFieldLabel(controlName)} must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.`;
			}
		}
		if (controlName === 'confirmPassword') {
			const password = this.getFormControl('accountInfo', 'password')?.value;
			if (password !== control.value) {
				return 'Password and conform password not Matched';
			}
		}
		if (controlName === 'name') {
			if (control.hasError('minlength')) {
				return `${this.getFieldLabel(controlName)} minimum length should be greater than 5`;
			}
			if (control.hasError('pattern')) {
				return `${this.getFieldLabel(controlName)} field only allow small , capital Letter  and spaces.`;
			}
		}
		if (controlName === 'pinCode' && control.hasError('pattern')) {
			return `${this.getFieldLabel(controlName)} must be six digit long.`;
		}
		return '';
	}
	//#endregion

	//#region Server Side Vaildation
	public isEmailInUse() {
		const email = this.registerForm.value.accountInfo.email;
		const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		if (emailRegex.test(email)) {
			this.emailLoading = true;
			this.authSvcs.isEmailInUse(email).pipe(takeUntil(this.destroy$)).subscribe({
				next: async (response) => {
					if (response.responseCode === 200) {
						this.isvalidMail = true;
					}
					else {
						this.isvalidMail = false;
					}
					this.emailLoading = false;
				},
				error: (err) => {
					this.emailLoading = false;
					this.isvalidMail = false;
				}
			});
		}
		else {
			this.isvalidMail = false;
		}
	}
	public isPhoneNumberInUse() {
		const phoneNumber = this.registerForm.value.accountInfo.phoneNumber;
		const phNoRegex = /^\d{10}$/;
		if (phNoRegex.test(phoneNumber)) {
			this.phoneNoLoading = true;
			this.authSvcs.isPhoneNumberInUse(phoneNumber).pipe(takeUntil(this.destroy$)).subscribe({
				next: async (response) => {
					if (response.responseCode === 200) {
						this.isPhoneNumberValid = true;
					}
					else {
						this.isPhoneNumberValid = false;
					}
					this.phoneNoLoading = false;
				},
				error: (err) => {
					this.phoneNoLoading = false;
					this.isPhoneNumberValid = false;
				}
			});
		}
		else {
			this.isPhoneNumberValid = false;
		}
	}
	public isUserExist() {
		const userName = this.registerForm.value.personalInfo.name;
		const userNameRegex = /^[A-Za-z\s]+$/;
		if (userNameRegex.test(userName) && userName.length > 5) {
			this.userNameLoading = true;
			this.authSvcs.isUserNameExist(userName).pipe(takeUntil(this.destroy$)).subscribe({
				next: async (response) => {
					if (response.responseCode === 200) {
						this.isUserValid = true;
					}
					else {
						this.isUserValid = false;
					}
					this.userNameLoading = false;
				},
				error: (err) => {
					this.userNameLoading = false;
					this.userNameLoading = false;
				}
			});
		}
		else {
			this.isUserValid = false;
		}
	}
	//#endregion      

	//#region Client Side Operations
	onProfilePhotoSelect(event: any) {
		if (event.files && event.files.length > 0) {
			const file = event.files[0];
			this.selectedProfilePhoto = file;
			this.registerForm.get('personalInfo.profilePhoto')?.setValue(file);
		}
	}
	onProfilePhotoRemove() {
		this.selectedProfilePhoto = null;
		this.registerForm.get('personalInfo.profilePhoto')?.setValue(null);
	}
	filterMaritalStatus(event: any) {
		const query = event.query.toLowerCase();
		this.filteredMaritalStatus = this.marriedStatus.filter(status =>
			status.value.toLowerCase().includes(query)
		);
	}
	filterGender(event: any) {
		const query = event.query.toLowerCase();
		this.filteredGender = this.gender.filter(status =>
			status.value.toLowerCase().includes(query)
		);
	}
	filterCountries(event: any) {
		const query = event.query.toLowerCase();
		this.filteredCountries = this.countries.filter(country =>
			country.countryName.toLowerCase().includes(query)
		);
	}
	filterStates(event: any) {
		const query = event.query.toLowerCase();
		this.filteredStates = this.states.filter(status =>
			status.stateName.toLowerCase().includes(query)
		);
	}
	filterDists(event: any) {
		const query = event.query.toLowerCase();
		this.filteredDists = this.dists.filter(status =>
			status.distName.toLowerCase().includes(query)
		);
	}
	onCountrySelect(event: any) {
		if (event) {
			this.getStates(event.value.countryId).subscribe((states) => {
				this.states = states;
				this.filteredStates = states;
				this.filteredDists = [];
				const addressGroup = this.registerForm.get('address');
				addressGroup?.patchValue({
					state: null,
					dist: null
				});
			});
		}
	}
	onStateSelect(event: any) {
		if (event) {
			this.getDists(event.value.stateId).subscribe((dists) => {
				this.filteredDists = dists;
				this.dists = dists;
				const addressGroup = this.registerForm.get('address');
				addressGroup?.patchValue({
					dist: null
				});
			});
		}
	}
	private async convertFormToFormData(formValue: any): Promise<FormData> {
		this.formData = new FormData();
		this.formData.append('Fk_TokenId', this.tokenId);
		this.formData.append('RouteUls', this.returnUrl);
		if (formValue.accountInfo) {
			this.formData.append('Email', formValue.accountInfo.email);
			this.formData.append('PhoneNumber', formValue.accountInfo.phoneNumber);
			this.formData.append('Password', formValue.accountInfo.password);
			this.formData.append('ConfirmPassword', formValue.accountInfo.confirmPassword);
		}
		if (formValue.personalInfo) {
			this.formData.append('Name', formValue.personalInfo.name);
			this.formData.append('BirthDate', formValue.personalInfo.birthDate ? new Date(formValue.personalInfo.birthDate).toISOString() : '');
			this.formData.append('MaratialStatus', formValue.personalInfo.maritalStatus?.key || '');
			this.formData.append('Gender', formValue.personalInfo.gender?.key || '');
			if (this.selectedProfilePhoto instanceof File) {
				this.formData.append('ProfilePhoto', this.selectedProfilePhoto, this.selectedProfilePhoto.name);
			} else {
				this.formData.append('ProfilePhoto', '');
			}
		}
		if (formValue.address) {
			this.formData.append('Address.Fk_CountryId', formValue.address.country?.countryId || '');
			this.formData.append('Address.Fk_StateId', formValue.address.state?.stateId || '');
			this.formData.append('Address.Fk_DistId', formValue.address.dist?.distId || '');
			this.formData.append('Address.At', formValue.address.at || '');
			this.formData.append('Address.Post', formValue.address.post || '');
			this.formData.append('Address.City', formValue.address.city || '');
			this.formData.append('Address.PinCode', formValue.address.pinCode || '');
		}
		return this.formData;
	}
	private resetForm(): void {
		this.registerForm.reset({
			accountInfo: {
				email: '',
				phoneNumber: '',
				password: '',
				confirmPassword: ''
			},
			personalInfo: {
				name: '',
				birthDate: '',
				profilePhoto: null,
				maritalStatus: '',
				gender: ''
			},
			address: {
				country: null,
				state: null,
				dist: null,
				at: '',
				post: '',
				city: '',
				pinCode: ''
			}
		});
	}
	//#endregion

	//#region Server Side Operations

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
	public vaildateToken() {
		if (this.tokenValue) {
			this.authSvcs.validateToken(this.tokenValue).pipe(takeUntil(this.destroy$)).subscribe({
				next: async (response) => {
					this.tokenId = response.data.records.tokenId;
					if (response.responseCode === 200) {
						this.messageService.success(response.message);
						if (this.registerForm.disabled) {
							this.registerForm.enable();
							this.getCountries().subscribe(response => {
								this.countries = response
							});
						}
					}
				},
				error: (err) => { }
			});
		} else {
			this.messageService.info('Please Enter Token');
		}
	}
	public async signUp(): Promise<void> {

		if (this.registerForm.invalid) {
			Object.keys(this.registerForm.controls).forEach(key => {
				const control = this.registerForm.get(key);
				control?.markAsTouched();
			});
			this.messageService.error('Please fill all required fields correctly');
			return;
		}
		else {
			this.isLoading = true;
			const formData = await this.convertFormToFormData(this.registerForm.value);
			this.authSvcs.signUp(formData).pipe(takeUntil(this.destroy$)).subscribe({
				next: async (response) => {
					if (response.responseCode === 201) {
						this.messageService.success('Registration successful');
					}
					this.isLoading = false;
					this.resetForm();
				},
				error: (error) => {
					this.isLoading = false;
				}
			});
		}
	}
	//#endregion

	//#region Test form
	get formJson(): string {
		return JSON.stringify(this.registerForm.value, null, 2);
	}
	get modelJson(): string {
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
	get formErrors(): string {
		return JSON.stringify(this.registerForm.errors, null, 2);
	}
	//#endregion
}
