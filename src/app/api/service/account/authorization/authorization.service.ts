import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { Base } from '../../../base';
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
  GetUserById(id: string): Observable<Base> {
    return this.configService.getEndpoint('user', 'getUserById').pipe(
      switchMap(endpoint =>
        this.http.get<Base>(`${endpoint}/${id}`)
      )
    );
  }
  GetImage(filename: string): Observable<any> {
    const params = new HttpParams().set('filename', filename);
    return this.configService.getEndpoint('user', 'getProfileImage').pipe(
      switchMap(endpoint =>
        this.http.get<any>(endpoint, { params })
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