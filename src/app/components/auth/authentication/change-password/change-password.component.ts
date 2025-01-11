import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ChangePasswordModel } from 'src/app/api/model/account/authentication/change-password-model';
import { AuthenticationService } from 'src/app/api/service/account/authentication/authentication.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
})
export class ChangePasswordComponent {
  changePass: ChangePasswordModel = new ChangePasswordModel();
  @ViewChild('changePasswordForm') changePasswordForm!: NgForm;
  constructor(
    private route: ActivatedRoute,
    private authSvcs: AuthenticationService
  ) {}
  submit(): void {
    this.authSvcs.changePassword(this.changePass)
      .subscribe({
        next: (response) => {

        },
        error: (error) => {
         
        },
        complete: () => {},
      });
}
}
