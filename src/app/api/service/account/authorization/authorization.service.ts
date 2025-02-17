import { Injectable } from '@angular/core';
import { catchError, map, Observable, switchMap, throwError } from 'rxjs';
import { Base } from '../../../model/base';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { UserRoleClaimModel } from '../../../model/account/autherization/user-role-claim-model';
import { ConfigService } from '../../config.Service';
import { GenericMessageService } from '../../generic-message.Service';
@Injectable({
  providedIn: 'root',
})
export class AuthorizationService {
  /*-------------------------------Constructor----------------------------------*/
  constructor(private http: HttpClient, private configService: ConfigService, private errorHandler: GenericMessageService) { }
  /*-------------------------------Api Service----------------------------------*/
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

 public  getUserById = (id: string): Observable<Base> => this.createHttpRequest('GET', 'getUserById', {}, undefined, id);
 public updateUser = (user: any): Observable<Base> => this.createHttpRequest('PATCH', 'updateUser', user);
 public getAllUserWithRolesAndClaims = (): Observable<Base> => this.createHttpRequest('GET', 'getAllUserWithRolesAndClaims');
 public updateUserRoleAndClaims = (data: UserRoleClaimModel): Observable<Base> => this.createHttpRequest('PATCH', 'updateUserRoleAndClaims', data);
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
}