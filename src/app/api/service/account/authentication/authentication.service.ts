import { SignInModel } from '../../../model/account/authentication/signIn-model';
import { ResetPasswordModel } from '../../../model/account/authentication/reset-password-model';
import { ChangePasswordModel } from '../../../model/account/authentication/change-password-model';
import { SignIn2faModel } from '../../../model/account/authentication/signin-2fa-model';
import { RegisterModel } from '../../../model/account/authentication/register-model';
import { JwtModel } from '../../../model/jwt-model';
import { Base } from '../../../base';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { ConfigService } from '../../config.Service';
import { StorageModel } from 'src/app/api/model/storage-model';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class AuthenticationService {
    /*------------------------------Property Declaration--------------------------*/
    getJwtToken = (): string | null => localStorage.getItem('jwtToken');
    isTwoFactorEnabled = (): boolean => {
        const storedValue = localStorage.getItem('2fa');
        return storedValue === 'true'
            ? true
            : storedValue === 'false'
                ? false
                : false;
    };
    isUserLogedIn = (): boolean => {
        const token = this.getJwtToken();
        if (!token) {
            return false;
        } else {
            return !this.isTokenExpired();
        }
    };
    /*-------------------------------Constructor----------------------------------*/
    constructor(
        private http: HttpClient,
        private configService: ConfigService,
        private router: Router
    ) { }
    /*-------------------------------Methods----------------------------------*/
    private isTokenExpired(): boolean {
        try {
            const token = this.getJwtToken();
            if (!token) {
                return true;
            } else {
                const decoded = jwtDecode(token);
                if (!decoded || !decoded['exp']) {
                    return true; // Token is invalid or missing exp claim
                } else {
                    const istokenExpired = Date.now() >= decoded['exp']! * 1000;
                    if (istokenExpired) {
                        this.Logout();
                    }
                    return istokenExpired;
                }
            }
        } catch (error) {
            console.error('Error decoding token:', error);
            return true; // Token is invalid or cannot be decoded
        }
    }
    getUserDetails(): JwtModel {
        const token = this.getJwtToken();

        const decodedtoken: any = jwtDecode(token ? token : '');
        const userDetails: JwtModel = {
            id:
                decodedtoken?.[
                'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
                ] ?? '',
            name:
                decodedtoken?.[
                'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'
                ] ?? '',
            email:
                decodedtoken?.[
                'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'
                ] ?? '',
            role:
                decodedtoken?.[
                'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
                ] ?? '',
            permissions: {
                create: decodedtoken?.['Create'] === 'Create',
                update: decodedtoken?.['Update'] === 'Update',
                delete: decodedtoken?.['Delete'] === 'Delete',
            },
            expirationTime: decodedtoken?.['exp'] ?? '',
            issuer: decodedtoken?.['iss'] ?? '',
            audience: decodedtoken?.['aud'] ?? '',
        };
        return userDetails;
    }
    //#region SignUp 
    /*-------------------------------Api Service----------------------------------*/
    validateToken(token: string): Observable<Base> {
        const params = new HttpParams().set('Token', token);
        return this.configService
            .getEndpoint('auth', 'validateToken')
            .pipe(
                switchMap((endpoint) =>
                    this.http.get<Base>(endpoint, { params })
                )
            );
    }
    isEmailInUse(email: string): Observable<Base> {
        const params = new HttpParams().set('email', email);
        return this.configService
            .getEndpoint('auth', 'isEmailInUse')
            .pipe(
                switchMap((endpoint) =>
                    this.http.get<Base>(endpoint, { params })
                )
            );
    }
    signUp(user: RegisterModel): Observable<Base> {
        return this.configService
            .getEndpoint('auth', 'signUp')
            .pipe(
                switchMap((endpoint) => this.http.post<Base>(endpoint, user))
            );
    }
    verifyConfirmEmail(uid: string, token: string): Observable<Base> {
        const params = new HttpParams().set('uid', uid).set('token', token);
        return this.configService
            .getEndpoint('auth', 'verifyConfirmEmail')
            .pipe(
                switchMap((endpoint) =>
                    this.http.get<Base>(endpoint, { params })
                )
            );
    }
    resendConfirmEmail(email: string, routeUrl: string): Observable<Base> {
        const params = new HttpParams()
            .set('email', email)
            .set('routeUrl', routeUrl);
        return this.configService
            .getEndpoint('auth', 'resendConfirmEmail')
            .pipe(
                switchMap((endpoint) =>
                    this.http.get<Base>(endpoint, { params })
                )
            );
    }
    //#endregion

    //#region Login
    /*-----------------------------------------Api Service-----------------------------------*/
    login(user: SignInModel): Observable<Base> {
        return this.configService
            .getEndpoint('auth', 'login')
            .pipe(
                switchMap((endpoint) => this.http.post<Base>(endpoint, user))
            );
    }
    /*----------------------------------Component Service-------------------------------------------*/
    handleLoginResponse(response: Base, email: string): string {
        let msg: string = '';
        switch (response.responseCode) {
            case 200:
                this.handleSuccessfulLogin(
                    response.data as StorageModel,
                    email
                );
                break;
            case 405:
                this.router.navigate(['auth/confirm-mail', response.message]);
                break;
            default:
                msg = "Unhandled response code:', response.responseCode";
        }
        return msg;
    }
    private handleSuccessfulLogin(storageData: StorageModel, email: string): void {
        localStorage.setItem('2fa', storageData.twoFactorEnable.toString());
        if (storageData.twoFactorEnable) {
            localStorage.setItem(
                'otpExpiredIn',
                storageData.otpExpiredIn.toString()
            );
            this.router.navigate(['auth/2fa', email]);
        } else {
            localStorage.setItem('jwtToken', storageData.jwtToken);
            this.router.navigate(['home/dashboard']);
        }
    }
    handleLoginError(response: any): string {
        let msg: string = '';
        switch (response.error.responseCode) {
            case 400:
                msg = response.error.message;
                break;
            default:
                msg = response.message;
        }
        return msg;
    }
    //#endregion

    //#region 2FA
    /*----------------------------------------Api Service------------------------------------------------*/
    loginWithOTP(data: SignIn2faModel): Observable<Base> {
        return this.configService
            .getEndpoint('auth', 'loginWithOTP')
            .pipe(
                switchMap((endpoint) => this.http.post<Base>(endpoint, data))
            );
    }
    resendTwoFactorToken(mail: string): Observable<Base> {
        const params = new HttpParams().set('mail', mail);
        return this.configService
            .getEndpoint('auth', 'reSendTwoFactorToken')
            .pipe(
                switchMap((endpoint) =>
                    this.http.get<Base>(endpoint, { params })
                )
            );
    }
    verifyTwoFactorToken(token: string): Observable<Base> {
        const params = new HttpParams().set('Token', token);
        return this.configService
            .getEndpoint('auth', 'verifyTwoFactorToken')
            .pipe(
                switchMap((endpoint) =>
                    this.http.get<Base>(endpoint, { params })
                )
            );
    }
    sendTwoFactorToken(): Observable<Base> {
        return this.configService
            .getEndpoint('auth', 'sendTwoFactorToken')
            .pipe(switchMap((endpoint) => this.http.get<Base>(endpoint)));
    }
    /*------------------------------------Component Service------------------------------------------------*/
    handleLoginWithOTPResponse(response: Base): string {
        let msg: string = '';
        switch (response.responseCode) {
            case 200:
                this.handleSuccessfulLoginWithOTP(
                    response.data as StorageModel
                );
                break;
            default:
                msg = `Unhandled response code: ${response.responseCode}`;
        }
        return msg;
    }
    private handleSuccessfulLoginWithOTP(storageData: StorageModel): void {
        localStorage.setItem('jwtToken', storageData.jwtToken);
        this.router.navigate(['home/dashboard']);
    }
    handleLoginWithOTPError(response: any): string {
        let msg: string = '';
        switch (response.error.responseCode) {
            case 400:
                msg = response.error.message;
                break;
            default:
                msg = response.message;
        }
        return msg;
    }
    handResendOTPResponse(response: any): string {
        let msg: string = '';
        switch (response.responseCode) {
            case 200:
                msg = response.message;
                break;
            default:
                msg = `Unhandled response code: ${response.responseCode}`
        }
        return msg;
    }
    handleResendOTPError(response: any): string {
        let msg: string = '';
        switch (response.error.responseCode) {
            case 400:
                msg = response.error.message;
                break;
            default:
                msg = response.message;
        }
        return msg;
    }
    /*------------------------------------------------------------------------------------------------------------------*/
    //#endregion 

    //#region Forgot, Reset && Change Password
    /*-------------------------------Api Service----------------------------------*/
    forgetPassword(email: string, routeUrl: string): Observable<Base> {
        const params = new HttpParams()
            .set('mail', email)
            .set('routeUrl', routeUrl);
        return this.configService
            .getEndpoint('auth', 'forgotPassword')
            .pipe(
                switchMap((endpoint) =>
                    this.http.get<Base>(endpoint, { params })
                )
            );
    }
    resetPassword(uid: string, token: string, data: ResetPasswordModel): Observable<Base> {
        const params = new HttpParams().set('uid', uid).set('token', token);
        return this.configService
            .getEndpoint('auth', 'resetPassword')
            .pipe(
                switchMap((endpoint) =>
                    this.http.post<Base>(endpoint, data, { params })
                )
            );
    }
    changePassword(data: ChangePasswordModel): Observable<Base> {
        return this.configService
            .getEndpoint('auth', 'changePassword')
            .pipe(
                switchMap((endpoint) => this.http.post<Base>(endpoint, data))
            );
    }
    //#endregion

    //#region LogOut
    Logout(): Observable<Base> {
        return this.configService
            .getEndpoint('auth', 'logOut')
            .pipe(
                switchMap((endpoint) => this.http.get<Base>(endpoint))
            );
        // localStorage.removeItem('jwtToken');
        // localStorage.removeItem('2fa');
    }
    //#endregion
}
