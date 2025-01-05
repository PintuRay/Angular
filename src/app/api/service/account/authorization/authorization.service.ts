import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { Base } from '../../../base';
import { HttpClient } from '@angular/common/http';
import { UserRoleClaimModel } from '../../../model/account/autherization/user-role-claim-model';
import { ConfigService } from '../../config.Service';
@Injectable({
  providedIn: 'root',
})
export class AuthorizationService {
  /*------------------------------Property Declaration--------------------------*/
 
  /*-------------------------------Constructor----------------------------------*/
  constructor(private http: HttpClient,private configService: ConfigService) {}
  /*----------------------------Other Methods-----------------------------------*/
  
  /*-------------------------------Api Service----------------------------------*/
  getAllUserWithRolesAndClaims(): Observable<Base>{
    return this.configService.getEndpoint('auth','getAllUserWithRolesAndClaims').pipe(
      switchMap(endpoint => 
        this.http.get<Base>(endpoint)
      )
    );
  }
  updateUserRoleAndClaims(data: UserRoleClaimModel): Observable<Base> {
    return this.configService.getEndpoint('auth','updateUserRoleAndClaims').pipe(
      switchMap(endpoint => 
        this.http.patch<Base>(endpoint, data)
      )
    ); 
  }
}