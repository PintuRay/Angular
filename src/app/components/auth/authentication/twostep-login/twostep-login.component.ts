import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { SignIn2faModel } from 'src/app/api/model/account/authentication/signin-2fa-model';
import { StorageModel } from 'src/app/api/model/storage-model';
import { AuthenticationService } from 'src/app/api/service/account/authentication/authentication.service';
import { LayoutService } from '../../../shared/service/app.layout.service';
import { GenericMessageService } from 'src/app/api/service/generic-message.Service';
@Component({
    selector: 'app-twostep-login',
    templateUrl: './twostep-login.component.html',
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
export class TwostepLoginComponent implements OnInit {
    /*------------------------------------------Property Declaration--------------------------------------------*/
    private readonly destroy$ = new Subject<void>();
    msg: string = '';
    email: any;
    TwoFactorLogin: SignIn2faModel = new SignIn2faModel();
    storage: StorageModel = new StorageModel();
    isLoading: boolean = false;
    get dark(): boolean {
        return this.layoutService.config().colorScheme !== 'light';
    }
    /*----------------------------------------------------Constructor-------------------------------------------*/
    constructor(
        public layoutService: LayoutService,
        private route: ActivatedRoute,
        private authSvcs: AuthenticationService,
        private messageService: GenericMessageService
    ) { }
    /*-----------------------------------------Lifecycle Hooks------------------------------------------------*/
    ngOnInit(): void {
        this.email = this.route.snapshot.paramMap.get('email');
        if (this.email) {
            this.TwoFactorLogin.Email = this.email;
        }
    }
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
    /*---------------------------------------------Operations--------------------------------------------------*/
    verifyOtp(): void {
        this.isLoading = true;
        if (this.TwoFactorLogin.OTP.length === 6) {
            this.authSvcs.loginWithOTP(this.TwoFactorLogin).pipe(takeUntil(this.destroy$)).subscribe({
                next: (response) => {
                    this.isLoading = false;
                    this.authSvcs.handleLoginWithOTPResponse(response);
                    this.reset();
                },
                error: (err) => {
                    this.isLoading = false;
                },
            });
        }
        else {
            this.messageService.error('Invalid OTP');
            this.isLoading = false;
            this.TwoFactorLogin.OTP = '';
        }
    }
    resendOtp(): void {
        this.authSvcs.resendTwoFactorToken(this.TwoFactorLogin.Email).pipe(takeUntil(this.destroy$)).subscribe({
            next: (response) => {
                if (response.responseCode === 200) {
                    this.messageService.success(response.message);
                }
            },
            error: (err) => { }
        })
    }
    reset(): void {
        this.TwoFactorLogin = new SignIn2faModel();
    }
}
