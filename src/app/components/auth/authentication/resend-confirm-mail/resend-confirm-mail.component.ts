import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthenticationService } from 'src/app/api/service/account/authentication/authentication.service';
import { environment } from 'src/app/utility/environment/environment';
@Component({
  selector: 'app-resend-confirm-mail',
  templateUrl: './resend-confirm-mail.component.html',
})
export class ResendConfirmMailComponent {
  isLoading = false;
  RouteUrl: string = environment.EmailConfirmation;
  message:string ='';
  mail: string = '';
  constructor(
    private route: ActivatedRoute,
    private authSvcs: AuthenticationService,
    private messageService: MessageService
  ) { }
  submit() {
    this.isLoading = true;
    this.authSvcs
      .resendConfirmEmail(this.mail, this.RouteUrl)
      .subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'success',
            detail: response.message,
          });
        },
        error: (response) => {
          this.isLoading = false;  
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response.error.message,
          });
        },
        complete: () => { 
          console.log('resend confirm mail Request completed');
        },
      });
  }
}
