import { Injectable } from '@angular/core';
import { map, Observable, switchMap } from 'rxjs';
import { Base } from '../../../model/base';
import { HttpClient, HttpParams } from '@angular/common/http';
import { UserRoleClaimModel } from '../../../model/account/autherization/user-role-claim-model';
import { ConfigService } from '../../config.Service';
@Injectable({
  providedIn: 'root',
})
export class AuthorizationService {
  /*------------------------------Property Declaration--------------------------*/

  /*-------------------------------Constructor----------------------------------*/
  constructor(private http: HttpClient, private configService: ConfigService) { }
  /*----------------------------Other Methods-----------------------------------*/

  /*-------------------------------Api Service----------------------------------*/
  getUserById(id: string): Observable<Base> {
    return this.configService.getEndpoint('user', 'getUserById').pipe(
      switchMap(endpoint =>
        this.http.get<Base>(`${endpoint}/${id}`)
      )
    );
  }
  updateUser(user: any):Observable<Base>{
    return this.configService
    .getEndpoint('user', 'updateUser')
    .pipe(
        switchMap((endpoint) => this.http.patch<Base>(endpoint, user))
    );
  }
  GetImage(filename: string): Observable<File> {
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
  getAllUserWithRolesAndClaims(): Observable<Base> {
    return this.configService.getEndpoint('auth', 'getAllUserWithRolesAndClaims').pipe(
      switchMap(endpoint =>
        this.http.get<Base>(endpoint)
      )
    );
  }

  updateUserRoleAndClaims(data: UserRoleClaimModel): Observable<Base> {
    return this.configService.getEndpoint('auth', 'updateUserRoleAndClaims').pipe(
      switchMap(endpoint =>
        this.http.patch<Base>(endpoint, data)
      )
    );
  }
}