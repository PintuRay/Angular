import { SignInModel } from '../../../model/account/authentication/signIn-model';
import { ResetPasswordModel } from '../../../model/account/authentication/reset-password-model';
import { ChangePasswordModel } from '../../../model/account/authentication/change-password-model';
import { SignIn2faModel } from '../../../model/account/authentication/signin-2fa-model';
import { JwtModel } from '../../../model/jwt-model';
import { Base } from '../../../model/base';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { ConfigService } from '../../config.Service';
import { StorageModel } from 'src/app/api/model/storage-model';
import { Router } from '@angular/router';
import { GenericMessageService } from '../../generic-message.Service';

@Injectable({
    providedIn: 'root',
})
export class AuthenticationService {
    //#region Constructor
    constructor(
        private http: HttpClient,
        private configService: ConfigService,
        private router: Router,
        private errorHandler: GenericMessageService
    ) { }
    //#endregion

    //#region local storage
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
                        this.clearLocalStorage();
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
    clearLocalStorage(): void {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('2fa');
    }
    //#endregion

    //#region Api Service
    private verifyConfirmEmailParams = (uid: string, token: string): HttpParams => new HttpParams().set('uid', uid).set('token', token);
    private resendConfirmEmailParams = (email: string, routeUrl: string): HttpParams => new HttpParams().set('email', email).set('routeUrl', routeUrl);
    private resendTwoFactorTokenParams = (mail: string): HttpParams => new HttpParams().set('mail', mail);
    private sendTwoFactorTokenParams = (uid: string): HttpParams => new HttpParams().set('uid', uid);
    private forgetPasswordParams = (email: string, routeUrl: string): HttpParams => new HttpParams().set('mail', email).set('routeUrl', routeUrl);

    private handleApiError(error: HttpErrorResponse): Observable<never> {
        this.errorHandler.handleApiError(error);
        return throwError(() => error);
    }
    private createHttpRequest<T>(methodType: string, endpointKey: string, data?: any, params?: HttpParams, id?: string): Observable<Base> {
        return this.configService.getEndpoint('authentication', endpointKey).pipe(
            switchMap(endpoint => {
                let url = endpoint;
                if (id) {
                    url = `${endpoint}/${id}`;
                }
                switch (methodType) {
                    case 'GET':
                        return this.http.get<Base>(url, { params });
                    case 'POST':
                        return this.http.post<Base>(url, data);
                    case 'PUT':
                        return this.http.put<Base>(url, data || {});
                    case 'PATCH':
                        return this.http.patch<Base>(url, data);
                    case 'DELETE':
                        return this.http.delete<Base>(url, { body: data });
                    default:
                        throw new Error('Invalid HTTP method');
                }
            }),
            catchError(this.handleApiError.bind(this))
        );
    }
    login = (user: SignInModel): Observable<Base> => this.createHttpRequest('POST', 'login', user);
    loginWithOTP = (data: SignIn2faModel): Observable<Base> => this.createHttpRequest('POST', 'loginWithOTP', data);
    verifyConfirmEmail = (uid: string, token: string): Observable<Base> => this.createHttpRequest('GET', 'verifyConfirmEmail', {}, this.verifyConfirmEmailParams(uid, token));
    resendConfirmEmail = (email: string, routeUrl: string): Observable<Base> => this.createHttpRequest('GET', 'resendConfirmEmail', {}, this.resendConfirmEmailParams(email, routeUrl));
    resendTwoFactorToken = (mail: string): Observable<Base> => this.createHttpRequest('GET', 'reSendTwoFactorToken', {}, this.resendTwoFactorTokenParams(mail));
    sendTwoFactorToken = (uid: string): Observable<Base> => this.createHttpRequest('GET', 'sendTwoFactorToken', {}, this.sendTwoFactorTokenParams(uid));
    verifyTwoFactorToken = (data: SignIn2faModel): Observable<Base> => this.createHttpRequest('POST', 'verifyTwoFactorToken', data);
    forgetPassword = (email: string, routeUrl: string): Observable<Base> => this.createHttpRequest('GET', 'forgotPassword', {}, this.forgetPasswordParams(email, routeUrl));
    resetPassword = (data: ResetPasswordModel): Observable<Base> => this.createHttpRequest('POST', 'resetPassword', data);
    changePassword = (data: ChangePasswordModel): Observable<Base> => this.createHttpRequest('POST', 'changePassword', data);
    //#endregion

    //#region Component Service

    handleLoginResponse(response: Base, email: string): void {
        switch (response.responseCode) {
            case 200:
                let storageData = response.data as StorageModel;
                localStorage.setItem('2fa', storageData.twoFactorEnable.toString());
                if (storageData.twoFactorEnable) {
                    localStorage.setItem('otpExpiredIn', storageData.otpExpiredIn.toString());
                    this.router.navigate(['auth/twostep-login', email]);
                } else {
                    localStorage.setItem('jwtToken', storageData.jwtToken);
                    this.router.navigate(['dashboard']);
                }
                break;
            case 405:
                this.router.navigate(['auth/confirm-mail', response.message]);
                break;
            default:
                break;
        }
    }
    handleLoginWithOTPResponse(response: Base): void {
        switch (response.responseCode) {
            case 200:
                let storageData = response.data as StorageModel
                localStorage.setItem('jwtToken', storageData.jwtToken);
                this.router.navigate(['dashboard']);
                break;
            default:
                break;
        }
    }
    //#endregion
}
