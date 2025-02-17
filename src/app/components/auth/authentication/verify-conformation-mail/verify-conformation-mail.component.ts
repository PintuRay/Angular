import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/app/api/service/account/authentication/authentication.service';
import { LayoutService } from '../../../shared/service/app.layout.service';
@Component({
  selector: 'app-verify-conformation-mail',
  templateUrl: './verify-conformation-mail.component.html',
})
export class VerifyConformationMailComponent {
  //#region Property Declaration
  uid: any;
  token: any;
  message: string = '';
  //#endregion

  //#region Constructor
  constructor(
    private route: ActivatedRoute,
    private authSvcs: AuthenticationService,
    public layoutSvcs: LayoutService,
  ) { }
  //#endregion

  //#region Lifecycle Hooks
  ngOnInit(): void {
    this.uid = this.route.snapshot.paramMap.get('uid');
    this.token = this.route.snapshot.paramMap.get('token');
    if (this.uid && this.token) {
      this.authSvcs.verifyConfirmEmail(this.uid, this.token).subscribe({
        next: async (response) => {
          if (response.responseCode === 200) {
            this.message = response.message
          }
        }
      });
    }
  }
  //#endregion
}
