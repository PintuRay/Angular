import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../utility/environment/environment';

interface ApiConfig {
    apiEndpoints?: {
        [category: string]: {
            [endpoint: string]: string;
        };
    }
}

@Injectable({
    providedIn: 'root',
})
export class ConfigService {
    private apiConfig: ApiConfig = {
        apiEndpoints: {
            auth: {
                validateToken: '{apiUrl}Auth/ValidateToken',
                isEmailInUse: '{apiUrl}Auth/IsEmailInUse',
                signUp: '{apiUrl}Auth/SignUp',
                verifyConfirmEmail: '{apiUrl}Auth/VerifyConfirmEmail',
                resendConfirmEmail: '{apiUrl}Auth/ResendConfirmEmail',
                forgotPassword: '{apiUrl}Auth/ForgotPassword',
                resetPassword: '{apiUrl}Auth/ResetPassword',
                changePassword: '{apiUrl}Auth/ChangePassword',
                login: '{apiUrl}Auth/Login',
                loginWithOTP: '{apiUrl}Auth/SignInWithOTP',
                logout:'{apiUrl}Auth/LogOut',
                verifyTwoFactorToken: '{apiUrl}Auth/VerifyTwoFactorToken',
                sendTwoFactorToken: '{apiUrl}Auth/SendTwoFactorToken',
                reSendTwoFactorToken: '{apiUrl}Auth/ReSendTwoFactorToken',
                getAllUserWithRolesAndClaims: '{apiUrl}User/GetAllUserWithRolesAndClaims',
                updateUserRoleAndClaims: '{apiUrl}User/UpdateUserRoleAndClaims',
            },
            devloper: {},
            admin: {},
            common :{
                getCountries: '{apiUrl}Common/Country/Get',
                getStates:'{apiUrl}Common/State/Get',
                getDists:'{apiUrl}Common/Dist/Get'
            }
        },
    };
    constructor(private http: HttpClient) { }
    getConfig(): Observable<ApiConfig> {
        return of(this.apiConfig).pipe(
            map((config) => {
                const processedConfig: ApiConfig = {
                    apiEndpoints: config.apiEndpoints
                        ? Object.fromEntries(
                            Object.entries(config.apiEndpoints).map(([category, endpoints]) => [
                                category,
                                Object.fromEntries(
                                    Object.entries(endpoints).map(([endpoint, url]) => [
                                        endpoint,
                                        url.replace('{apiUrl}', environment.apiUrl),
                                    ])
                                ),
                            ])
                        )
                        : {},
                };
                return processedConfig;
            }),
        );
    }

    getEndpoint(category: string, endpoint: string): Observable<string> {
        return this.getConfig().pipe(
            map((config) => {
                const categoryEndpoints = config.apiEndpoints?.[category];
                if (!categoryEndpoints) {
                    throw new Error(`Category not found: ${category}`);
                }
                const fullEndpoint = categoryEndpoints[endpoint];
                if (!fullEndpoint) {
                    throw new Error(`Endpoint not found for category ${category}: ${endpoint}`);
                }
                return fullEndpoint;
            })
        );
    }
}