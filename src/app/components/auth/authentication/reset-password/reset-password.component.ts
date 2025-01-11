import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ResetPasswordModel } from 'src/app/api/model/account/authentication/reset-password-model';
import { AuthenticationService } from 'src/app/api/service/account/authentication/authentication.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent {

  message: string = '';
  isLoading = false;
  resetPass: ResetPasswordModel = new ResetPasswordModel();
  passwordVisible: boolean = false;
  confirmPasswordVisible: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private authSvcs: AuthenticationService,
    private messageService: MessageService
  ) { }
  ngOnInit(): void {
    this.resetPass.uid = this.route.snapshot.paramMap.get('uid') ?? '';
    this.resetPass.token = this.route.snapshot.paramMap.get('token') ??'';
  }
  async submit(): Promise<void> {
    try {
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
    catch (error) {
      console.error('Error in signup:', error);
      this.isLoading = false;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An error occurred'});
    }
  }
}