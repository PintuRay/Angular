import { UserClaimModel } from './user-claim-model';
import { UserRoleModel } from './user-role-model';

export class UserRoleClaimModel{
  id: string;
  name: string;
  userRoles: UserRoleModel[];
  userClaims: UserClaimModel[];
  constructor(){
    this.id ='';
    this.name='';
    this.userRoles= [];
    this.userClaims =[];
  }
}