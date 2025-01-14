import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { ChangePasswordModel } from 'src/app/api/model/account/authentication/change-password-model';
import { AuthenticationService } from 'src/app/api/service/account/authentication/authentication.service';
import { DialogService } from 'src/app/components/shared/service/dialog.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
  changePass: ChangePasswordModel = new ChangePasswordModel();
  showPasswordMismatch = false;
  isLoading = false;
  visible: boolean = false;
  private subscription!: Subscription;
  constructor(
    private router: Router,
    private dialogService: DialogService,
    private authSvcs: AuthenticationService,
    private messageService: MessageService

  ) { }
  ngOnInit() {
    this.subscription = this.dialogService.dialogVisibility$.subscribe(
      isVisible => {
        this.visible = isVisible;
      }
    );
    console.log('visible', this.visible);
  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  hideDialog() {
    this.dialogService.hideDialog();
  }
  checkPasswordMatch() {
    if (this.changePass.newPassword && this.changePass.confirmNewPassword) {
      this.showPasswordMismatch = !this.changePass.passwordsMatch();
    }
  }
  isFormValid(): boolean {
    return this.changePass.isValid() && !this.isLoading;
  }
  submit(): void {
    this.authSvcs.changePassword(this.changePass)
      .subscribe({
        next: (response) => {
          if (response.responseCode === 200) {
            this.visible = false;
            this.authSvcs.clearLocalStorage();
            this.router.navigate(['auth/login', response.message]);
          }
        },
        error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.message });
        },
        complete: () => { },
      });
  }
}
