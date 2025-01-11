import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/app/api/service/account/authentication/authentication.service';

@Component({
  selector: 'app-verify-conformation-mail',
  templateUrl: './verify-conformation-mail.component.html',
})
export class VerifyConformationMailComponent {
  uid: any;
  token: any;
  message: string = '';
  constructor(
    private route: ActivatedRoute,
   private authSvcs: AuthenticationService,
  ) {}
  ngOnInit(): void {
    this.uid = this.route.snapshot.paramMap.get('uid');
    this.token = this.route.snapshot.paramMap.get('token');
    if (this.uid && this.token) {
      this.authSvcs.verifyConfirmEmail(
        this.uid,
        this.token
      ).subscribe({
        next: (response) => {
          console.log(response);
          this.message = response.message;
        },
        error: (error) => {
          console.log('Some Error Occoured', error);
        },
        complete: () => {
          console.log('Request completed');
        },
      });
    }
  }
}
