import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '../../config.Service';
import { BehaviorSubject, catchError, distinctUntilChanged, Observable, switchMap, throwError } from 'rxjs';
import { Base } from '../../../model/base';
import { PaginationParams } from '../../../model/paginationParams';
import { UserBranchMessageService } from './user-branch-message.service';
import { UserBranchModel, UserBranchOperation, UserBranchUpdateModel } from 'src/app/api/entity/userBranch';
@Injectable()
export class UserBranchService {
    //#region Property Declaration
    private changeRecoverVisibilitySubject = new BehaviorSubject<boolean>(false);
    changeRecoverDialogVisibility$ = this.changeRecoverVisibilitySubject.asObservable();
    private addUpdateVisibilitySubject = new BehaviorSubject<boolean>(false);
    changeAddUpdateDialogVisibility$ = this.addUpdateVisibilitySubject.asObservable();
    private userBranchSubject = new BehaviorSubject<UserBranchOperation | null>(null);
    private recoverUserBranchSubject = new BehaviorSubject<UserBranchOperation | null>(null);
    private operationTypeSubject = new BehaviorSubject<string>('');
    //#endregion

    //#region Constructor
    constructor(
        private http: HttpClient,
        private configService: ConfigService,
        private errorHandler: UserBranchMessageService
    ) { }
    //#endregion

    //#region Api
    private handleApiError(error: HttpErrorResponse): Observable<never> {
        this.errorHandler.handleApiError(error);
        return throwError(() => error);
    }
    private buildHttpParams = (data: PaginationParams): HttpParams => {
        let params = new HttpParams()
            .set('pageNumber', data.pageNumber.toString())
            .set('pageSize', data.pageSize.toString());

        if (data.searchTerm) {
            params = params.set('searchTerm', data.searchTerm);
        }
        return params;
    }
    private createHttpRequest<T>(methodType: string, endpointKey: string, data?: any, params?: HttpParams, id?: string): Observable<Base> {
        return this.configService.getEndpoint('admin', endpointKey).pipe(
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
    public get = (data: PaginationParams): Observable<Base> => this.createHttpRequest('GET', 'getUserBranches', null, this.buildHttpParams(data));
    public create = (data: UserBranchModel): Observable<Base> => this.createHttpRequest('POST', 'createUserBranch', data);
    public update = (data: UserBranchUpdateModel): Observable<Base> => this.createHttpRequest('PATCH', 'updateUserBranch', data);
    public remove = (id: string): Observable<Base> => this.createHttpRequest('PUT', 'removeUserBranch', {}, undefined, id);
    public getRemoved = (data: PaginationParams): Observable<Base> => this.createHttpRequest('GET', 'getRemovedUserBranches', null, this.buildHttpParams(data))
    public recover = (id: string): Observable<Base> => this.createHttpRequest('PUT', 'recoverUserBranch', {}, undefined, id);
    public delete = (id: string): Observable<Base> => this.createHttpRequest('DELETE', 'deleteUserBranch', null, undefined, id)
    //#endregion

    //#region component service
    public showAddUpdatedDialog = () => this.addUpdateVisibilitySubject.next(true);
    public hideAddUpdateDialog = () => this.addUpdateVisibilitySubject.next(false);
    public showRecoverDialog = () => this.changeRecoverVisibilitySubject.next(true);
    public hideRecoverDialog = () => this.changeRecoverVisibilitySubject.next(false);
    public setOperationType = (operationType: string) => this.operationTypeSubject.next(operationType);
    public getOperationType = (): Observable<string> => this.operationTypeSubject.asObservable().pipe(distinctUntilChanged());
    public setUserBranch = (userBranchOperation: UserBranchOperation | null): void => this.userBranchSubject.next(userBranchOperation);
    public getUserBranch = (): Observable<UserBranchOperation | null> => this.userBranchSubject.asObservable();
    public setRecoverUserBranch = (recoverUserBranchOperation: UserBranchOperation| null): void => this.recoverUserBranchSubject.next(recoverUserBranchOperation);
    public getRecoverUserBranch = (): Observable<UserBranchOperation | null> => this.recoverUserBranchSubject.asObservable();
    //#endregion
}