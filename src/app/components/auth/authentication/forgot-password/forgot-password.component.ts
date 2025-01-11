import { Component } from '@angular/core';
import { LayoutService } from '../../../shared/service/app.layout.service';
import { environment } from 'src/app/utility/environment/environment';
import { AuthenticationService } from 'src/app/api/service/account/authentication/authentication.service';
import { MessageService } from 'primeng/api';

@Component({
	selector: 'app-forgot-password',
	templateUrl: './forgot-password.component.html'
})
export class ForgotPasswordComponent {
	//#region Property Declaration
	restPasswordUrl: string = environment.ResetPassword;
	message: string = '';
	isLoading = false;
	//#endregion
	//#region constructor
	constructor(
		public layoutService: LayoutService,
		private authSvcs: AuthenticationService,
		private messageService: MessageService
	) { }
	//#endregion
	//#region Themme
	get dark(): boolean {
		return this.layoutService.config().colorScheme !== 'light';
	}
	//#endregion
	//#region Server Side Operations
	async submit(emailInput: HTMLInputElement): Promise<void> {
		const email = emailInput.value;
		const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		try {
			if (emailRegex.test(email)) {
				this.isLoading = true;
				this.authSvcs.forgetPassword(emailInput.value, this.restPasswordUrl)
				.subscribe({
				  next: (response) => {
					this.messageService.add({
					  severity: 'success',
					  summary: 'success',
					  detail: response.message,
					});
					this.isLoading = false;
				  },
				  error: (response) => {
					this.messageService.add({
					  severity: 'error',
					  summary: 'error',
					  detail:  response.error.message,
					});
					this.isLoading = false;
				  },
				  complete: () => { 
					this.isLoading = false;
					console.log('forgot password Request completed');
				  },
				});
			}
			else {
				this.messageService.add({
					severity: 'error',
					summary: 'Error',
					detail: 'invalid mail'
				});
			}
		}
		catch (error) {
			console.error('Error in signup:', error);
			this.isLoading = false;
			this.messageService.add({
				severity: 'error',
				summary: 'Error',
				detail: 'An error occurred'
			});
		}
	}
	//#endregion
}
