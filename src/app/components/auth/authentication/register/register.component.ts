import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AuthenticationService } from 'src/app/api/service/account/authentication/authentication.service';
import { CommonService } from 'src/app/api/service/common/common.services';
import { LayoutService } from '../../../shared/service/app.layout.service';
import { environment } from 'src/app/utility/environment/environment';
import { MenuItem } from 'primeng/api';
import { Country } from 'src/app/api/entity/country';
import { State } from 'src/app/api/entity/state';
import { Dist } from 'src/app/api/entity/dist';
@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit {
	//#region Property Declaration
	registerForm!: FormGroup;
	formData: FormData = new FormData();
	returnUrl: string = environment.EmailConfirmation;
	msg: string = '';
	tokenValue: string = '';
	tokenId: string = '';
	isLoading = false;
	emailLoading = false;
	phoneNoLoading = false;
	items: MenuItem[] = [];
	activeIndex: number = 0;
	countries: Country[] = [];
	filteredCountries: Country[] = [];
	states: State[] = [];
	filteredStates: State[] = [];
	dists: Dist[] = [];
	filteredDists: Dist[] = [];
	marriedStatus: any[] = [];
	filteredMaritalStatus: any[] = [];
	gender: any[] = [];
	filteredGender: any[] = [];
	isvalidMail = false;
	isPhoneNumberValid =false;
	selectedProfilePhoto: File | null = null;
	display: boolean = false;
	//#endregion 
	//#region constructor
	constructor(
		private fb: FormBuilder,
		public layoutSvcs: LayoutService,
		private authSvcs: AuthenticationService,
		private commonSvcs: CommonService,
		private messageService: MessageService) { }
	//#endregion
	//#region Themme
	get dark(): boolean {
		return this.layoutSvcs.config().colorScheme !== 'light';
	}
	//#endregion
	//#region Lifecycle Hooks
	ngOnInit(): void {
		this.initializeRegisterForm();
		this.initializeSteps();
		this.registerForm.disable();
	}
	//#endregion
	//#region Form Initialization
	private initializeRegisterForm(): void {
		this.registerForm = this.fb.group({
			// Account Information
			accountInfo: this.fb.group({
				email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
				phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
				password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*!])[A-Za-z\d@#$%^&*!]{8,}$/)]],
				confirmPassword: ['', [Validators.required, Validators.minLength(8)]]
			}),
			// Personal Information
			personalInfo: this.fb.group({
				name: ['', [Validators.required, Validators.minLength(5), Validators.pattern(/^[A-Z\s]+$/)]],
				birthDate: ['', [Validators.required]],
				profilePhoto: [null, [Validators.required]],
				maritalStatus: ['', [Validators.required]],
				gender: ['', [Validators.required]],
			}),
			// Address Information	
			address: this.fb.group({
				Country: ['', [Validators.required]],
				State: ['', [Validators.required]],
				Dist: ['', [Validators.required]],
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
	get nameControl() {
		return this.registerForm.get('name');
	}
	getNameErrorMessage() {
		if (this.nameControl?.hasError('required')) {
			return 'Name is required.';
		}
		return '';
	}
	get emailControl() {
		return this.registerForm.get('email');
	}
	getEmailErrorMessage() {
		if (this.emailControl?.hasError('required')) {
			return 'Email is required.';
		}
		if (this.emailControl?.hasError('pattern')) {
			return 'Email should be in bellow Format e.g John@example.com.';
		}
		return '';
	}
	get phoneControl() {
		return this.registerForm.get('phoneNumber');
	}
	getPhoneErrorMessage() {
		if (this.phoneControl?.hasError('required')) {
			return 'Phone Number is required.';
		} else if (this.phoneControl?.hasError('pattern')) {
			return 'Phone Number Must Be 10  digit.';
		} else {
			return '';
		}
	}
	get passwordControl() {
		return this.registerForm.get('password');
	}
	getPasswordErrorMessage() {
		if (this.passwordControl?.hasError('required')) {
			return 'Password is required.';
		} else if (this.passwordControl?.hasError('minlength')) {
			return 'Password must be at least 8 characters long.';
		} else if (this.passwordControl?.hasError('pattern')) {
			return 'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.';
		} else {
			return '';
		}
	}
	get conformPasswordControl() {
		return this.registerForm.get('confirmPassword');
	}
	getConformPasswordErrorMessage() {
		if (this.passwordControl?.value != this.conformPasswordControl?.value) {
			return 'Password and conform password not Matched';
		} else if (this.passwordControl?.hasError('required')) {
			return 'conform password is required';
		} else {
			return '';
		}
	}
	//#endregion
	//#region Server Side Vaildation
	isEmailInUse(): void {
		const email = this.registerForm.value.accountInfo.email;
		const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		if (emailRegex.test(email)) {
			this.emailLoading = true ;
			this.authSvcs.isEmailInUse(email).subscribe({
				next: (response) => {
					if (response.responseCode == 200) {
						this.isvalidMail = true;
					}
					else{
						this.isvalidMail = false;
					}
				},
				error: (response) => {
					this.emailLoading = false ;
					this.messageService.add({severity: 'error', summary: 'error', detail: response.error.message});
				},
				complete: () => {
					this.emailLoading = false ;
					console.log('isEmailInUse Request completed');
				},
			});
		}
		else{
			this.isvalidMail = false;
		}
	}
	isPhoneNumberInUse(): void {
		const phoneNumber = this.registerForm.value.accountInfo.phoneNumber;
		const phNoRegex = /^\d{10}$/;
		if (phNoRegex.test(phoneNumber)) {
			this.phoneNoLoading = true ;
			this.authSvcs.isPhoneNumberInUse(phoneNumber).subscribe({
				next: (response) => {
					if (response.responseCode == 200) {
						this.isPhoneNumberValid = true;
					}
					else{
						this.isPhoneNumberValid = false;
					}
				},
				error: (response) => {
					this.phoneNoLoading = false ;
					this.messageService.add({severity: 'error', summary: 'error', detail: response.error.message});
				},
				complete: () => {
					this.phoneNoLoading = false ;
					console.log('isPhoneNumberInUse Request completed');
				},
			});
		}
		else{
			this.isPhoneNumberValid = false;
		}
	}
	isUserExist():void{
		
	}
	//#endregion      
	//#region Client Side Operations
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
		const addressGroup = this.registerForm.get('address');
		addressGroup?.patchValue({
			State: null,
			Dist: null
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
		const addressGroup = this.registerForm.get('address');
		addressGroup?.patchValue({
			Dist: null
		});
		this.dists = [];
		this.filteredDists = [];
		if (event.value.stateId) {
			this.getDists(event.value.stateId);
		}
	}
	//#endregion
	//#region Server Side Operations
	vaildateToken(): void {
		if (this.tokenValue) {
			this.authSvcs.validateToken(this.tokenValue).subscribe({
				
				next: (response) => {
					console.log(response);
					this.tokenId = response.data.singleObjData.tokenId;
					if (response.responseCode == 200) {
						this.messageService.add({ severity: 'success', summary: 'success', detail: response.message });
						if (this.registerForm.disabled) {
							this.registerForm.enable();
							this.getCountries();
							this.marriedStatus = [
								{ key: 'married', value: 'Married' },
								{ key: 'unmarred', value: 'UnMarried' },
							];
							this.gender = [
								{ key: 'male', value: 'Male' },
								{ key: 'female', value: 'Female' },
								{ key: 'other', value: 'other' },
							];
						}
					}
				},
				error: (response) => {
					this.messageService.add({
						severity: 'error',
						summary: 'error',
						detail: response.error.message,
					});
				},
				complete: () => {
					// console.log('Validation Request completed');
				},
			});
		} else {
			this.messageService.add({
				severity: 'warn',
				summary: 'warn',
				detail: 'Please Enter Token',
			});
		}
	}
	getCountries() {
		this.commonSvcs.getCountries().subscribe({
			next: (response) => {
				if (response.responseCode == 200) {
					this.countries = response.data.collectionObjData as Country[]
				}
			},
			error: (response) => {
				this.messageService.add({
					severity: 'error',
					summary: 'error',
					detail: response.error.message,
				});
			},
			complete: () => {
				// console.log('coutries Request completed');
			},
		});
	}
	getStates(counryId: any) {
		this.commonSvcs.getStates(counryId).subscribe({
			next: (response) => {
				if (response.responseCode == 200) {
					this.states = response.data.collectionObjData as State[]
				}
			},
			error: (response) => {
				this.messageService.add({
					severity: 'error',
					summary: 'error',
					detail: response.error.message,
				});
			},
			complete: () => {
				// console.log('states Request completed');
			},
		});
	}
	getDists(stateId: any) {
		this.commonSvcs.getDists(stateId).subscribe({
			next: (response) => {
				if (response.responseCode == 200) {
					this.dists = response.data.collectionObjData as Dist[]
				}
			},
			error: (response) => {
				this.messageService.add({
					severity: 'error',
					summary: 'error',
					detail: response.error.message,
				});
			},
			complete: () => {
				// console.log('dists Request completed');
			},
		});
	}
	private async convertFormToFormData(formValue: any): Promise<FormData> {
		this.formData = new FormData();
		this.formData.append('FkTokenId', this.tokenId);
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
			this.formData.append('Address.Fk_CountryId', formValue.address.Country?.countryId || '');
			this.formData.append('Address.Fk_StateId', formValue.address.State?.stateId || '');
			this.formData.append('Address.Fk_DistId', formValue.address.Dist?.distId || '');
			this.formData.append('Address.At', formValue.address.at || '');
			this.formData.append('Address.Post', formValue.address.post || '');
			this.formData.append('Address.City', formValue.address.city || '');
			this.formData.append('Address.PinCode', formValue.address.pinCode || '');
		}
		return this.formData;
	}
	async signUp(): Promise<void> {	
		try {
			if (this.registerForm.invalid) {
				Object.keys(this.registerForm.controls).forEach(key => {
					const control = this.registerForm.get(key);
					control?.markAsTouched();
				});
				this.messageService.add({
					severity: 'error',
					summary: 'Validation Error',
					detail: 'Please fill all required fields correctly'
				});
				return;
			}
			else{
				this.isLoading = true;
				const formData = await this.convertFormToFormData(this.registerForm.value);
				this.authSvcs.signUp(formData).subscribe({
					next: (response) => {
						if (response.responseCode === 201) {
							this.messageService.add({
								severity: 'success',
								summary: 'Success',
								detail: 'Registration successful'
							});
						}
					},
					error: (error) => {
						console.error('Registration error:', error);
						this.isLoading = false;
						this.messageService.add({
							severity: 'error',
							summary: 'Error',
							detail: error.error?.message || 'Registration failed'
						});
					},
					complete: () => {
						this.isLoading = false; 
						this.resetForm();
					},
				});
			}
		}
		catch (error) {
			console.error('Error in signup:', error);
			this.isLoading = false;
			this.messageService.add({
				severity: 'error',
				summary: 'Error',
				detail: 'An error occurred during registration'
			});
		}
	}
	private resetForm(): void {
		this.registerForm.reset({
			name: '',
			email: '',
			phoneNumber: '',
			password: '',
			confirmPassword: '',
			profilePhoto: null,
			termCondition: false,
			birthDate: '',
			maritalStatus: '',
			gender: '',
			address: {
				fk_CountryId: '',
				fk_StateId: '',
				fk_DistId: '',
				at: '',
				post: '',
				city: '',
				pinCode: ''
			}
		});
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
