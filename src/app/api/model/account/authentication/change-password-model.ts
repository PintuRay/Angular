import { ResetPasswordModel } from "./reset-password-model";
export class ChangePasswordModel extends ResetPasswordModel{
    currentPassword: string;
    constructor(){
     super();
     this.currentPassword='';
    }
}