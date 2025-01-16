import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { TopBarService } from '../../../service/topbar.service';
import { AuthenticationService } from 'src/app/api/service/account/authentication/authentication.service';
import { SignIn2faModel } from 'src/app/api/model/account/authentication/signin-2fa-model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verify-two-factor-token',
  templateUrl: './verify-two-factor-token.component.html',
  styles: [`
    .custom-otp-input {
        width: 48px;
        height: 48px;
        font-size: 24px;
        appearance: none;
        text-align: center;
        transition: all 0.2s;
        border-radius: 0;
        border: 1px solid var(--surface-400);
        background: transparent;
        outline-offset: -2px;
        outline-color: transparent;
        border-right: 0 none;
        transition: outline-color 0.3s;
        color: var(--text-color);
    }

    .custom-otp-input:focus {
        outline: 2px solid var(--primary-color);
    }

    .custom-otp-input:first-child,
    .custom-otp-input:nth-child(5) {
        border-top-left-radius: 12px;
        border-bottom-left-radius: 12px;
    }

    .custom-otp-input:nth-child(3),
    .custom-otp-input:last-child {
        border-top-right-radius: 12px;
        border-bottom-right-radius: 12px;
        border-right-width: 1px;
        border-right-style: solid;
        border-color: var(--surface-400);
    }
`],
})
export class VerifyTwoFactorTokenComponent {
  visible: boolean = false;
  isLoading = false;
  twoFactor: SignIn2faModel = new SignIn2faModel();
  private subscription!: Subscription;
  constructor(
    private topBarService: TopBarService,
    private authSvcs: AuthenticationService,
     private router: Router,
  ) { }
  ngOnInit() {
    this.twoFactor.Email = this.authSvcs.getUserDetails().email;
    this.subscription = this.topBarService.veriyTwoFactordialogVisibility$.subscribe(
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
  hideDialog() {
    this.topBarService.hideVerifyTwFactorDialog();
  }
  async verifyOtp(): Promise<void> {
    this.isLoading = true;
    if (this.twoFactor.OTP.length === 6) {
      this.authSvcs.verifyTwoFactorToken(this.twoFactor).subscribe({
        next: (response) => {
          if (response.responseCode === 200) {
            this.authSvcs.clearLocalStorage();
            this.router.navigate(['auth/login', response.message]);
          }
          this.isLoading = false;
        },
        error: (response) => {
          this.isLoading = false;
        },
        complete: () => {},
      });
    }
    else {

    }
  }
}
