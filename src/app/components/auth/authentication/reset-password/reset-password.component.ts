import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ResetPasswordModel } from 'src/app/api/model/account/authentication/reset-password-model';
import { AuthenticationService } from 'src/app/api/service/account/authentication/authentication.service';
import { LayoutService } from 'src/app/components/shared/service/app.layout.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent implements OnInit {
  //#region Property Declaration
  message: string = '';
  isLoading = false;
  resetPass: ResetPasswordModel = new ResetPasswordModel();
  showPasswordMismatch = false;
  showPasswordError = false;
  passwordErrors: string[] = [];
  //#endregion
  //#region constructor
  constructor(
    private route: ActivatedRoute,
    private authSvcs: AuthenticationService,
    public layoutSvcs: LayoutService,
    private messageService: MessageService
  ) { }
  //#endregion
  //#region Themme
  get dark(): boolean {
    return this.layoutSvcs.config().colorScheme !== 'light';
  }
  //#endregion
  //#region Lifecycle Hooks
  ngOnInit(): void {
    this.resetPass.uid = this.route.snapshot.paramMap.get('uid') ?? '';
    this.resetPass.token = this.route.snapshot.paramMap.get('token') ?? '';
  }
  //#endregion
   //#region Client side Vaildation
   checkPasswordMatch() {
    if (!this.resetPass.newPassword || !this.resetPass.confirmNewPassword) {
        this.showPasswordMismatch = false;
    } else {
        this.showPasswordMismatch = !this.resetPass.passwordsMatch();
    }
    this.validatePassword();
}
  validatePassword() {
    this.passwordErrors = [];
    const password = this.resetPass.newPassword;
    
    // Reset errors if password is empty
    if (!password || password.trim() === '') {
        this.showPasswordError = false;
        return;
    }

    if (password.length < 8) {
      this.passwordErrors.push('Password must be at least 8 characters long');
  }
  if (!/[a-z]/.test(password)) {
      this.passwordErrors.push('Password must contain at least one lowercase letter');
  }
  if (!/[A-Z]/.test(password)) {
      this.passwordErrors.push('Password must contain at least one uppercase letter');
  }
  if (!/[0-9]/.test(password)) {
      this.passwordErrors.push('Password must contain at least one number');
  }
  // Modified this condition to specifically check for special characters
  if (!/[@#$%^&*!]/.test(password)) {
      this.passwordErrors.push('Password must contain at least one special character');
  }
    this.showPasswordError = this.passwordErrors.length > 0;
}
   //#endregion
  //#region Client Side Operations

  isFormValid(): boolean {
    return this.resetPass.isValid() && !this.isLoading;
  }
  //#endregion
  //#region Server Side Operations
  async submit(): Promise<void> {
    try {
      if (!this.resetPass.passwordsMatch()) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Passwords do not match'
        });
        return;
      }
      else {
        this.isLoading = true;
        this.authSvcs.resetPassword(this.resetPass)
          .subscribe({
            next: (response) => {
              if (response.responseCode == 200) {
                this.messageService.add({ severity: 'success', summary: 'success', detail: response.message, });
              }
              this.isLoading = false;
            },
            error: (response) => {
              this.messageService.add({ severity: 'error', summary: 'error', detail: response.error.message });
              this.isLoading = false;
            },
            complete: () => {
              this.isLoading = false;
              console.log('reset password Request completed');
            },
          });
      }
    }
    catch (error) {
      this.isLoading = false;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An error occurred' });
    }
  }
  //#endregion
}
