import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { ChangePasswordModel } from 'src/app/api/model/account/authentication/change-password-model';
import { AuthenticationService } from 'src/app/api/service/account/authentication/authentication.service';
import { TopBarService } from 'src/app/components/shared/service/topbar.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
  //#region Property Declaration
  changePass: ChangePasswordModel = new ChangePasswordModel();
  showPasswordMismatch = false;
  isLoading = false;
  visible: boolean = false;
  private subscription!: Subscription;
  showPasswordError = false;
  passwordErrors: string[] = [];
  //#endregion
  //#region Constructor
  constructor(
    private router: Router,
    private topBarService: TopBarService,
    private authSvcs: AuthenticationService,
    private messageService: MessageService
  ) { }
  //#endregion
  //#region Lifecycle Hooks
  ngOnInit() {
    this.subscription = this.topBarService.changePassworddialogVisibility$.subscribe(
      isVisible => {
        this.visible = isVisible;
      }
    );
  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  //#endregion
  //#region Client side Vaildation
  checkPasswordMatch() {
    if (!this.changePass.newPassword || !this.changePass.confirmNewPassword) {
        this.showPasswordMismatch = false;
    } else {
        this.showPasswordMismatch = !this.changePass.passwordMatch();
    }
    this.validatePassword();
}
  validatePassword() {
    this.passwordErrors = [];
    const password = this.changePass.newPassword;
    
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
  hideDialog() {
    this.topBarService.hideChangePasswordDialog();
  }
  isFormValid(): boolean {
    return this.changePass.isValid() && !this.isLoading;
  }
  //#endregion
  //#region Server Side Operations
  submit(): void {
    this.isLoading = true;
    this.authSvcs.changePassword(this.changePass)
      .subscribe({
        next: (response) => {
          if (response.responseCode === 200) {
            this.authSvcs.clearLocalStorage();
            this.router.navigate(['auth/login', response.message]);
            }
            this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.message });
        },
        complete: () => { },
      });
  }
  //#endregion
}
