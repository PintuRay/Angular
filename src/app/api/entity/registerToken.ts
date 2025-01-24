import { RegisterModel } from "../model/account/authentication/user-model";

export class RegisterTokenModel {
    tokenValue: string = '';
  
    constructor() {
      // Optionally, set default values here if needed
    }
  }
  
  export class RegisterToken extends RegisterTokenModel {
    tokenId: string = '';
    isActive?: boolean;
    createdDate?: Date;
    modifyDate?: Date;
    createdBy?: string = '';
    modifyBy?: string = '';
    user: RegisterModel = new RegisterModel();
  
    constructor() {
      super();
      // Optionally, set default values here if needed
    }
  }
  