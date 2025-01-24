import { UserModel } from "../model/account/authentication/user-model";
import { Branch } from "./branch";

export class UserBranchModel {
    fk_UserId: string = '';
    fk_BranchId: string = '';
  
    constructor() {
      // Optionally, set default values here if needed
    }
  }
  
  export class UserBranch extends UserBranchModel {
    id: string = '';
    isActive?: boolean;
    createdDate?: Date;
    modifyDate?: Date;
    createdBy?: string = '';
    modifyBy?: string = '';
    user: UserModel = new UserModel();
    branch: Branch = new Branch();
  
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
  