import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { RegisterModel } from 'src/app/api/model/account/authentication/register-model';
import { AuthenticationService } from 'src/app/api/service/account/authentication/authentication.service';
import { CommonService } from 'src/app/api/service/common/common.services';
import { LayoutService } from '../../../shared/service/app.layout.service';
import { environment } from 'src/app/utility/environment/environment';

@Component({
	templateUrl: './register.component.html',
	styles: [
        `
        .p-stepper {
            flex-basis: 50rem;
        } 
        `
    ]
})
export class RegisterComponent implements OnInit {
	//#region Property Declaration
	user: RegisterModel = new RegisterModel();
	registerForm!: FormGroup;
	returnUrl: string = environment.EmailConfirmation;
	msg: string = '';
	tokenValue: string = '';
	isLoading = false;
	get dark(): boolean {
		return this.layoutService.config().colorScheme !== 'light';
	}
	//#endregion 
	
	//#region constructor
	constructor(
		private fb: FormBuilder,
		public layoutService: LayoutService,
		private authSvcs: AuthenticationService,
		private commonSvcs : CommonService,
		private messageService: MessageService) { }
	//#endregion
	
	//#region Lifecycle Hooks
	ngOnInit(): void {
		this.initializeRegisterForm();
		this.user.routeUls = this.returnUrl;
		this.registerForm.valueChanges.subscribe((values) => {
			this.user = { ...this.user, ...values };
		});
		this.registerForm.disable();
	}
	//#endregion
	
	//#region Form Initialization
	private initializeRegisterForm(): void {
		this.registerForm = this.fb.group({
			name: ['', [Validators.required, Validators.minLength(5), Validators.pattern(/^[A-Z\s]+$/)]],
			email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
			phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
			password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*!])[A-Za-z\d@#$%^&*!]{8,}$/)]],
			confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
			ProfilePhoto: [null, [Validators.required]],
			termCondition: [false, [Validators.required]],
			birthDate: ['', [Validators.required]],
			maritalStatus: ['', [Validators.required]],
			gender: ['', [Validators.required]],
			address: this.fb.group({
				fk_CountryId: ['', [Validators.required]],
				fk_StateId: ['', [Validators.required]],
				fk_DistId: ['', [Validators.required]],
				at: ['', [Validators.required]],
				post: ['', [Validators.required]],
				city: ['', [Validators.required]],
				pinCode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
			})
		});
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
	vaildateToken(): void {
		if (this.tokenValue) {
			this.authSvcs.validateToken(this.tokenValue).subscribe({
				next: (response) => {
					this.user.fkTokenId = response.data.tokenId;
					if (response.responseCode == 200) {
						this.messageService.add({ severity: 'success', summary: 'success', detail: response.message });
						if (this.registerForm.disabled) {
							this.registerForm.enable();
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
					console.log('Validation Request completed');
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
	isEmailInUse(): void {
		const email = this.user.email;
		const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		if (emailRegex.test(email)) {
			this.authSvcs.isEmailInUse(this.user.email).subscribe({
				next: (response) => {
					if (response.responseCode == 200) {
						//this.message = response.message;
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
					console.log('isEmailInUse Request completed');
				},
			});
		}
	}
	//#endregion

	//#region Operations
	signUp(): void {
		this.isLoading = true;
		this.authSvcs.signUp(this.user).subscribe({
		  next: (response) => {
			if (response.responseCode == 201) {
			//  this._router.navigate(['auth/confirm-mail',response.message]);
			}
		  },
		  error: (response) => {
			this.isLoading = false;
			this.messageService.add({
			  severity: 'error',
			  summary: 'error',
			  detail:  response.error.message,
			});
		  },
		  complete: () => {
			this.isLoading = false;
			this.resetForm();
		  },
		});
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
	//#endrgion
}
