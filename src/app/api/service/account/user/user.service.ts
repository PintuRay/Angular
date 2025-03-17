import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ConfigService } from "../../config.Service";
import { GenericMessageService } from "../../generic-message.Service";
import { catchError, map, Observable, switchMap, throwError } from "rxjs";
import { Base } from "src/app/api/model/base";

@Injectable({
    providedIn: 'root',
})
export class UserService {
    //#region Constructor
    constructor(
        private http: HttpClient,
        private configService: ConfigService,
        private errorHandler: GenericMessageService
    ) { }
    //#endregion
    //#region Api Service
    private isEmailInUseParams = (email: string): HttpParams => new HttpParams().set('email', email);
    private validateTokenParams = (token: string): HttpParams => new HttpParams().set('Token', token);
    private isPhoneNumberInUseParams = (phNo: string): HttpParams => new HttpParams().set('phoneNumber', phNo);
    private isUserNameExistParams = (userName: string): HttpParams => new HttpParams().set('userName', userName);

    private handleApiError(error: HttpErrorResponse): Observable<never> {
        this.errorHandler.handleApiError(error);
        return throwError(() => error);
    }

    private createHttpRequest<T>(methodType: string, endpointKey: string, data?: any, params?: HttpParams, id?: string): Observable<Base> {
        return this.configService.getEndpoint('user', endpointKey).pipe(
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
    public validateToken = (token: string): Observable<Base> => this.createHttpRequest('GET', 'validateToken', {}, this.validateTokenParams(token));
    public isEmailInUse = (email: string): Observable<Base> => this.createHttpRequest('GET', 'isEmailInUse', {}, this.isEmailInUseParams(email));
    public isPhoneNumberInUse = (phNo: string): Observable<Base> => this.createHttpRequest('GET', 'isPhoneNumberInUse', {}, this.isPhoneNumberInUseParams(phNo));
    public isUserNameExist = (userName: string): Observable<Base> => this.createHttpRequest('GET', 'isUserNameExist', {}, this.isUserNameExistParams(userName));
    public signUp = (user: any): Observable<Base> => this.createHttpRequest('POST', 'signUp', user);
    public getUserById = (id: string): Observable<Base> => this.createHttpRequest('GET', 'getUserById', {}, undefined, id);
    public updateUser = (user: any): Observable<Base> => this.createHttpRequest('PATCH', 'updateUser', user);
    public GetImage(filename: string): Observable<File> {
        const params = new HttpParams().set('filename', filename);
        return this.configService.getEndpoint('user', 'getProfileImage').pipe(
          switchMap(endpoint =>
            this.http.get(endpoint, {
              params,
              responseType: 'blob'
            }).pipe(
              map(response => {
                const ext = filename.split('.').pop()?.toLowerCase();
                const mimeType = ext === 'png' ? 'image/png' :
                  ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' :
                    ext === 'gif' ? 'image/gif' :
                      'application/octet-stream';
                return new File([response], 'profile_photo.png', { type: mimeType });
              })
            )
          )
        );
      }
    //#endregion
}