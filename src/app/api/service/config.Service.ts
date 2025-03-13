import { Injectable } from '@angular/core';
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
                isPhoneNumberInUse: '{apiUrl}Auth/IsPhoneNumberInUse',
                isUserNameExist: '{apiUrl}Auth/IsUserNameExist',
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
            },
            user: {
                getUserById:'{apiUrl}User/GetById',
                getProfileImage:'{apiUrl}User/GetImage',
                updateUser:'{apiUrl}User/Update',
                getAllUserWithRolesAndClaims: '{apiUrl}User/GetAllUserWithRolesAndClaims',
                updateUserRoleAndClaims: '{apiUrl}User/UpdateUserRoleAndClaims',
            },
            devloper: {
                /*Branch*/
                getBranches:'{apiUrl}Branch/Get',
                createBranch:'{apiUrl}Branch/Create',
                bulkCreateBranch:'{apiUrl}Branch/BulkCreate',
                updateBranch:'{apiUrl}Branch/Update',
                bulkUpdateBranch:'{apiUrl}Branch/BulkUpdate',
                removeBranch:'{apiUrl}Branch/Remove',
                bulkRemoveBranch:'{apiUrl}Branch/BulkRemove',
                getRemovedBranches:'{apiUrl}Branch/GetRemoved',
                recoverBranch:'{apiUrl}Branch/Recover',
                bulkRecoverBranch:'{apiUrl}Branch/BulkRecover',
                deleteBranch:'{apiUrl}Branch/Delete',
                bulkDeleteBranch:'{apiUrl}Branch/BulkDelete',
                /*FinancialYear*/
                getAllFinancialYears:'{apiUrl}FinancialYear/GetAll',
                getFinancialYears:'{apiUrl}FinancialYear/Get',
                createFinancialYear:'{apiUrl}FinancialYear/Create',
                bulkCreateFinancialYear:'{apiUrl}FinancialYear/BulkCreate',
                updateFinancialYear:'{apiUrl}FinancialYear/Update',
                bulkUpdateFinancialYear:'{apiUrl}FinancialYear/BulkUpdate',
                removeFinancialYear:'{apiUrl}FinancialYear/Remove',
                bulkRemoveFinancialYear:'{apiUrl}FinancialYear/BulkRemove',
                getRemovedFinancialYears:'{apiUrl}FinancialYear/GetRemoved',
                recoverFinancialYear:'{apiUrl}FinancialYear/Recover',
                bulkRecoverFinancialYear:'{apiUrl}FinancialYear/BulkRecover',
                deleteFinancialYear:'{apiUrl}FinancialYear/Delete',
                bulkDeleteFinancialYear:'{apiUrl}FinancialYear/BulkDelete',
            },
            admin: {},
            common :{
                getCountries: '{apiUrl}Common/Country/Get',
                getStates:'{apiUrl}Common/State/Get',
                getDists:'{apiUrl}Common/Dist/Get',
                getBranches:'{apiUrl}Common/Branch/Get',
                getFinancialYears:'{apiUrl}Common/FinancialYear/Get',
            }
        },
    };

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