import { Component } from '@angular/core';
import { LayoutService } from '../../../shared/service/app.layout.service';
import { environment } from 'src/app/utility/environment/environment';
import { AuthenticationService } from 'src/app/api/service/account/authentication/authentication.service';
import { Subject, takeUntil } from 'rxjs';
import { GenericMessageService } from 'src/app/api/service/generic-message.Service';

@Component({
	selector: 'app-forgot-password',
	templateUrl: './forgot-password.component.html'
})
export class ForgotPasswordComponent {
	//#region Property Declaration
	private readonly destroy$ = new Subject<void>();
	restPasswordUrl: string = environment.ResetPassword;
	message: string = '';
	isLoading = false;
	//#endregion

	//#region constructor
	constructor(
		public layoutSvcs: LayoutService,
		private authSvcs: AuthenticationService,
		private messageService: GenericMessageService
	) { }
	//#endregion

	//#region Lifecycle Hooks
	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}
	//#endregion

	//#region Server Side Operations
	public submit(emailInput: HTMLInputElement) {
		const email = emailInput.value;
		const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		if (emailRegex.test(email)) {
			this.isLoading = true;
			this.authSvcs.forgetPassword(emailInput.value, this.restPasswordUrl).pipe(takeUntil(this.destroy$)).subscribe({
					next: async (response) => {
						if (response.responseCode === 200) {
							this.messageService.success(response.message);
						}
						this.isLoading = false;
					},
					error: (err) => {
						this.isLoading = false;
					}
				});
		}
		else {
			this.messageService.warning('Please Enter Valid Email');
		}
	}
	//#endregion
}
